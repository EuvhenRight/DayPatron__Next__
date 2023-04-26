import { useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import ProfileHeadshot from 'sections/profile/ProfileHeadshot';
import ProfilePersonal from 'sections/profile/ProfilePersonal';

// ==============================|| PROFILE - PERSONAL ||============================== //

const ProfilePersonalPage = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <ProfileHeadshot focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <ProfilePersonal />
      </Grid>
    </Grid>
  );
};

export default ProfilePersonalPage;
