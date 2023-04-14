// material-ui
import { useTheme } from '@mui/material/styles';

import logoIconDark from 'assets/images/logo-icon-dark.png';
import logoIcon from 'assets/images/logo-icon.png';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
     <img src={theme.palette.mode === 'dark' ? logoIconDark : logoIcon} alt="10x" width="30" />
  );
};

export default LogoIcon;
