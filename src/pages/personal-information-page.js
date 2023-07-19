import { useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import PersonalInformation from 'sections/PersonalInformation';
import PersonalInformationHeadshot from 'sections/PersonalInformationHeadshot';

// ==============================|| EMPLOYER USER - DETAILS ||============================== //

const PersonalInformationPage = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <PersonalInformationHeadshot focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <PersonalInformation />
      </Grid>
    </Grid>
  );
};

export default PersonalInformationPage;
