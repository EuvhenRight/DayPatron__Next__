import { useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { Outlet } from 'react-router';

// project import
import ProfileTabs from 'sections/profiles/ProfileTabs';

// ==============================|| PROFILE - USER ||============================== //

const ProfilePage = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Outlet context={inputRef} />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
