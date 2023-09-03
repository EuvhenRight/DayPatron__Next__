import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';

// project imports
import Loader from 'components/Loader';
import { LOGIN, LOGOUT, PERSONAL_INFORMATION_GET } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

import { useKeycloak } from '@react-keycloak/web';

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| KEYCLOAK - CONTEXT & PROVIDER ||============================== //

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { keycloak } = useKeycloak();
  const dispatchGlobal = useDispatch();

  const fetchContractor = async () => {
    try {
      let contractorIdentifier = keycloak.idTokenParsed.preferred_username;
      if (keycloak.tokenParsed.roles.includes('admin') && localStorage.getItem('adminSelectedContractorId')) {
        contractorIdentifier = localStorage.getItem('adminSelectedContractorId');
      }

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorIdentifier),
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

  useEffect(() => {
    (async () => {
      if (keycloak?.authenticated) {
        dispatch({
          type: LOGIN,
          payload: {
            user: {
              email: keycloak?.tokenParsed?.email,
              name: keycloak?.tokenParsed?.name
            }
          }
        });
      }

      let fetchContractorResponse = await fetchContractor();
      if (fetchContractorResponse.success) {
        dispatchGlobal({ type: PERSONAL_INFORMATION_GET, payload: fetchContractorResponse.data });
      }
    })();
  }, [keycloak.authenticated]);

  const logout = () => {
    keycloak.logout();
    dispatch({ type: LOGOUT });
  };
  
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <KeycloakContext.Provider value={{ ...state, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
};

KeycloakProvider.propTypes = {
  children: PropTypes.node
};

export default KeycloakContext;
