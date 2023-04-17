import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// project imports
import Loader from 'components/Loader';
import { LOGIN, LOGOUT } from 'store/reducers/actions';
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
  useEffect(
    () => {
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
    },
    [keycloak.authenticated]
  );

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
