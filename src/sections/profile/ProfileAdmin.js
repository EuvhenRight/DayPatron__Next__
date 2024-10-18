import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useKeycloak } from '@react-keycloak/web';
import tiers from 'data/tiers';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';
import MainCard from 'components/MainCard';

import {
  Select,
  Button,
  Grid,
  InputLabel,
  Stack,
  MenuItem,
  Typography
} from '@mui/material';

const ProfileAdmin = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const state = useSelector(state => state.personalInformation);
  const [selectedContractorTier, setSelectedContractorTier] = useState(state.tier);

  const handleSave = async () => {
    if(!selectedContractorTier)
      return;

    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(state.id) + '/tiers',
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({tier: selectedContractorTier})
      }
    );

    if (!response.ok) {
      dispatch(openSnackbar({ open: true, message: 'Failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
      return;
    }

    dispatch(openSnackbar({ open: true, message: 'Success.', variant: 'alert', alert: { color: 'success' }, close: false }));

    let json = await response.json();
    var newState = { ...state };
    newState.tier = json.tier;

    dispatch({ type: PERSONAL_INFORMATION_UPDATE, payload: newState });

    setSelectedContractorTier(json.tier);
  };

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <></>

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Admin</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="contractorTier">Tier</InputLabel>
            <Select
              id="contractorTier"
              name="contractorTier"
              displayEmpty
              value={normalizeInputValue(selectedContractorTier)}
              onChange={(e) => {
                setSelectedContractorTier(e.target.value);
              }}
            >
              {tiers.map((tier) => (
                <MenuItem key={tier.code} value={tier.code}>
                  {tier.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{height: "100%"}}>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfileAdmin;
