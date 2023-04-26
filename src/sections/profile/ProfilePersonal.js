// material-ui
import { useOutletContext } from 'react-router';

import { useDispatch } from 'react-redux';

import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// material-ui
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
// import { useInputRef } from './index';
import MainCard from 'components/MainCard';

function useInputRef() {
  return useOutletContext();
}

// ==============================|| PERSONAL ||============================== //

const ProfilePersonal = () => {

  const {keycloak} = useKeycloak();
  const [contractor, setContractor] = useState({ firstName: '', lastName: '', email: '', dateOfBirth: null });

  const fetchContractor = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + keycloak.idTokenParsed.preferred_username,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      return { success: true, data: json };
    } catch (error) {
      return { success: false };
    }
  }
  useEffect(() => {
    (async () => {
      let res = await fetchContractor();
      if (res.success) {
        setContractor(res.data);
      }
    })();
  }, []);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const dispatch = useDispatch();
  const inputRef = useInputRef();

  return (
    <MainCard content={false} title="Personal Information" sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstname: contractor.firstName,
          lastname: contractor.lastName,
          email: contractor.email,
          dateOfBirth: contractor.dateOfBirth ? new Date(contractor.dateOfBirth) : '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required.'),
          lastname: Yup.string().max(255).required('Last Name is required.'),
          email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
          dateOfBirth: Yup.date().max(maxDate, 'Age should be 18+ years.').required('Date of birth is requird.')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + keycloak.idTokenParsed.preferred_username,
              {
                method: 'PUT',
                headers: {
                  'Authorization': 'Bearer ' + keycloak.idToken,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              }
            );

            if (!reponse.ok) {
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Personal profile update failed.',
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  },
                  close: false
                })
              );

              setStatus({ success: false });
              setSubmitting(false);

              return;
            }

            let json = await response.json();

            setContractor(json);
            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            setErrors({ submit: err.message });
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-first-name"
                      value={values.firstname}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.firstname && errors.firstname && (
                      <FormHelperText error id="personal-first-name-helper">
                        {errors.firstname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-last-name"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    {touched.lastname && errors.lastname && (
                      <FormHelperText error id="personal-last-name-helper">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email Address"
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="personal-email-helper">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-date">Date of Birth</InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={values.dateOfBirth ? values.dateOfBirth : null}
                          inputFormat="yyyy-MM-dd"
                          openTo="year"
                          maxDate={maxDate}
                          onChange={(newValue) => {
                            setFieldValue('dateOfBirth', newValue);
                          }}
                          renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                        />
                      </LocalizationProvider>
                    </Stack>
                    {touched.dateOfBirth && errors.dateOfBirth && (
                      <FormHelperText error id="personal-dob-helper">
                        {errors.dateOfBirth}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                  Save
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default ProfilePersonal;
