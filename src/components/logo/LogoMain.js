import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/logo-dark.png';
import logo from 'assets/images/logo.png';



// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {
  const theme = useTheme();
  return (
    
    <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="10x" width="100" style={{margin: "17px 0px 7px 0px"}} />
    
  );
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
