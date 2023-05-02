import { useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployerHeadshot from 'sections/employer/EmployerHeadshot';
import EmployerDetails from 'sections/employer/EmployerDetails';

// ==============================|| EMPLOYER - DETAILS ||============================== //

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
