import { useState, useEffect } from 'react';

import {
  Autocomplete,
  TextField,
  Button,
  Grid,
  Stack
} from '@mui/material';

import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

const AddMissionContractorMatch = ({ missionId, bindMissionMatches }) => {
  const { keycloak } = useKeycloak();
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const dispatch = useDispatch();

  const bindContractors = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setContractors(json.contractors);
    } catch (error) {
      return { success: false };
    }
  }

  useEffect(() => {
    (async () => {
      await bindContractors();
    })();
  }, [keycloak?.idToken]);

  const handleAddMatchClick = async () => {
    if(!selectedContractor)
      return;

    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/matches/' + encodeURIComponent(selectedContractor.id),
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({isMatch: true})
      }
    );

    if (!response.ok) {
      dispatch(openSnackbar({ open: true, message: 'Matching failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
      return;
    }

    dispatch(openSnackbar({ open: true, message: 'Matched.', variant: 'alert', alert: { color: 'success' }, close: false }));
    await bindMissionMatches();
    setSelectedContractor(null);
  };

  if(!keycloak.tokenParsed.roles.includes('admin'))
    return;

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <Autocomplete
          fullWidth
          value={selectedContractor}
          onChange={async (event, newValue) => {
            setSelectedContractor(newValue);
          }}
          options={contractors ?? []}
          autoHighlight
          getOptionLabel={(option) => option?.firstName + ' ' + option?.lastName + ' (' + option?.email + ')'}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Add a match"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off'
              }}
              value={null}
            />
          )}
        />
      </Grid>
      <Grid item sx={{width: "70px"}}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{height: "100%"}}>
          <Button onClick={handleAddMatchClick} variant="contained">Add</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AddMissionContractorMatch;
