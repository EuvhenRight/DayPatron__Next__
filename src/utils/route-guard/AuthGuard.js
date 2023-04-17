import PropTypes from 'prop-types';

// project import
import { useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import { APP_DEFAULT_PATH } from 'config';
import { useLocation, useNavigate } from 'react-router-dom';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(APP_DEFAULT_PATH, {
        state: {
          from: ''
        },
        replace: true
      });
    }
  }, [location, navigate]);

  return isLoggedIn ? children : null;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
