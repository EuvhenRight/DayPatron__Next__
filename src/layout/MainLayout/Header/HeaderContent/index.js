// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}></Box>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      <Message />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
