import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllEmployerUsers } from '_api/employerUsers';
import { EMPLOYER_USERS_GET } from 'store/reducers/actions';
import { Autocomplete, TextField, Box, useMediaQuery } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';

// project import
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const dispatch = useDispatch();
  const adminSelectedEmployerUser = useSelector(state => state.personalInformation);
  const employerUsers = useSelector(state => state.employerUsers);

  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { keycloak } = useKeycloak();

  const fetchEmployerUser = async (employerUserId) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users/' + encodeURIComponent(employerUserId),
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

  const getAdminSelectedEmployerUserLabel = (user) => {
    let prefix = '';
    if (user.userName === keycloak.idTokenParsed.preferred_username) {
      prefix = '<ME> ';
    }

    let fullName = '';
    if(user?.firstName && user?.lastName)
      fullName = user?.firstName + ' ' + user?.lastName;
    else if(user?.firstName)
      fullName = user?.firstName;
    else if(user?.lastName)
      fullName = user?.lastName;

    let emailPrefix = fullName ? ' (' : '';
    let emailSuffix = fullName ? ')' : '';

    let result = prefix + fullName + emailPrefix + user?.email + emailSuffix + ' - ' + user?.userStatus;
    return result;
  }
  
  useEffect(() => {
    (async () => {
      if (keycloak.tokenParsed.roles.includes('admin')) {
        var users = await getAllEmployerUsers(keycloak);
        dispatch({ type: EMPLOYER_USERS_GET, payload: users });
      }
    })();
  }, [keycloak?.tokenParsed?.roles, keycloak?.idToken]);

  return (
    <>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}></Box>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {keycloak.tokenParsed.roles.includes('admin') &&
        <Autocomplete
          id="admin-selected-employer-user-id"
          fullWidth
          value={adminSelectedEmployerUser}
          onChange={async (event, newValue) => {
            if (keycloak.tokenParsed.roles.includes('admin') && newValue?.id) {
              let fetchEmployerUserResponse = await fetchEmployerUser(newValue.id);
              if (fetchEmployerUserResponse.success) {
                localStorage.setItem('adminSelectedEmployerUserId', fetchEmployerUserResponse.data.id);
                window.location.reload(false);
              }
            }
          }}
          options={employerUsers ?? []}
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          getOptionLabel={(option) => getAdminSelectedEmployerUserLabel(option)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Choose an employer user"
              name="admin-selected-employer-user-id"
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
