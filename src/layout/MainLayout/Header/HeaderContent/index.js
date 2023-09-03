import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete, TextField, Box, useMediaQuery } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';

// project import
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const adminSelectedContractor = useSelector(state => state.personalInformation);
  const [contractors, setContractors] = useState([]);
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { keycloak } = useKeycloak();

  const fetchContractor = async (contractorId) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      return { success: true, data: json };
    } catch (error) {
      return { success: false };
    }
  }

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
      if (keycloak.tokenParsed.roles.includes('admin')) {
        await bindContractors();
      }
    })();
  }, []);

  return (
    <>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}></Box>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {keycloak.tokenParsed.roles.includes('admin') && 
        <Autocomplete
          id="admin-selected-contractor-id"
          fullWidth
          value={adminSelectedContractor}
          onChange={async (event, newValue) => {
            if (keycloak.tokenParsed.roles.includes('admin')) {
              let fetchContractorResponse = await fetchContractor(newValue.id);
              if (fetchContractorResponse.success) {
                localStorage.setItem('adminSelectedContractorId', fetchContractorResponse.data.id);
                window.location.reload(false);
              }
            }
          }}
          options={contractors ?? []}
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          getOptionLabel={(option) => option?.firstName + ' ' + option?.lastName + '(' + option?.email + ')'}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Choose a contractor"
              name="admin-selected-contractor-id"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password'
              }}
            />
          )}
        />
      }
      <Notification />
      <Message />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
