import { useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployerHeadshot from 'sections/profile/EmployerHeadshot';
import EmployerDetails from 'sections/profile/EmployerDetails';

// ==============================|| PROFILE - PERSONAL ||============================== //

const EmployerDetailsPage = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <EmployerHeadshot focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <EmployerDetails />
      </Grid>
    </Grid>
  );
};

export default EmployerDetailsPage;
