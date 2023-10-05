// material-ui
import { Grid } from '@mui/material';

// project import
import ProfileHeadshot from 'sections/profile/ProfileHeadshot';
import ProfilePersonal from 'sections/profile/ProfilePersonal';
import ProfileDocuments from 'sections/profile/ProfileDocuments';

// ==============================|| PROFILE - PERSONAL ||============================== //

const ProfilePersonalPage = () => {


  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <ProfileHeadshot />
      </Grid>
      <Grid item xs={12} md={9}>
        <ProfilePersonal />
      </Grid>
      <Grid item xs={12} md={3}>
      </Grid>
      <Grid item xs={12} md={9}>
        <ProfileDocuments />
      </Grid>
    </Grid>
  );
};

export default ProfilePersonalPage;
