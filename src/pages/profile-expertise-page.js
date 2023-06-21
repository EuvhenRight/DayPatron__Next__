// material-ui
import industries from 'data/industries';
import jobRoles from 'data/jobRoles';
import languages from 'data/languages';
import countries from 'data/countries';
import companyStages from 'data/companyStages';
import financingStages from 'data/financingStages';

import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';

const ProfileExpertisePage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const [expertise, setExpertise] = useState(null);
  const [industriesInputText, setIndustriesInputText] = useState('');
  const [jobRolesInputText, setJobRolesInputText] = useState('');
  const [languagesInputText, setLanguagesInputText] = useState('');
  const [countriesInputText, setCountriesInputText] = useState('');
  const [companyStagesInputText, setCompanyStagesInputText] = useState('');
  const [financingStagesInputText, setFinancingStagesInputText] = useState('');
  
  const bindExpertise = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/expertise',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setExpertise(json);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    (async () => {
      await bindExpertise();
    })();
  }, []);

  return (
    <MainCard content={false} sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          industries: expertise?.industries ? industries.filter(x => expertise.industries.find(y => x.code === y)) : null,
          jobRoles: expertise?.jobRoles ?jobRoles.filter(x => expertise.jobRoles.find(y => x.code === y)) : null,
          languages: expertise?.languages ?languages.filter(x => expertise.languages.find(y => x.code === y)) : null,
          countries: expertise?.countries ?countries.filter(x => expertise.countries.find(y => x.code === y)) : null,
          companyStages: expertise?.companyStages ?companyStages.filter(x => expertise.companyStages.find(y => x.code === y)) : null,
          financingStages: expertise?.financingStages ?financingStages.filter(x => expertise.financingStages.find(y => x.code === y)) : null,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          industries: Yup.array().of(Yup.object()).nullable(true),
          jobRoles: Yup.array().of(Yup.object()).nullable(true),
          languages: Yup.array().of(Yup.object()).nullable(true),
          countries: Yup.array().of(Yup.object()).nullable(true),
          companyStages: Yup.array().of(Yup.object()).nullable(true),
          financingStages: Yup.array().of(Yup.object()).nullable(true)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            var body = {
              industries: values?.industries?.map(x => x.code),
              jobRoles: values?.jobRoles?.map(x => x.code),
              languages: values?.languages?.map(x => x.code),
              countries: values?.countries?.map(x => x.code),
              companyStages: values?.companyStages?.map(x => x.code),
              financingStages: values?.financingStages?.map(x => x.code)
            }
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/expertise',
              {
                method: 'PUT',
                headers: {
                  'Authorization': 'Bearer ' + keycloak.idToken,
                  'Content-Type': 'application/json'
                },
                body: prepareApiBody(body)
              }
            );

            if (!response.ok) {
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Update failed.',
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

            setExpertise(json);

            dispatch(
              openSnackbar({
                open: true,
                message: 'Data updated.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );

            setStatus({ success: true });
            setSubmitting(false);
            setErrors({});
          } catch (err) {
            setErrors({ submit: err.message });
            setStatus({ success: false });
            setSubmitting(false);

            dispatch(
              openSnackbar({
                open: true,
                message: 'Update failed.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
        }}
      >
        {({ errors, handleBlur, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="industries">Industries</InputLabel>
                    <Autocomplete
                      id="industries"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={industries}
                      value={values.industries ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setIndustriesInputText('');
                        } else {
                          setFieldValue('industries', newValue);
                        }
                      }}
                      inputValue={industriesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setIndustriesInputText('');
                        } else if (reason !== 'reset') {
                          setIndustriesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select industries"
                          name="industries"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.industries && errors.industries && (
                      <FormHelperText error id="industries-helper">
                        {errors.industries}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="job-roles">Job Roles</InputLabel>
                    <Autocomplete
                      id="job-roles"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={jobRoles}
                      value={values.jobRoles ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setJobRolesInputText('');
                        } else {
                          setFieldValue('jobRoles', newValue);
                        }
                      }}
                      inputValue={jobRolesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setJobRolesInputText('');
                        } else if (reason !== 'reset') {
                          setJobRolesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select job roles"
                          name="jobRoles"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.jobRoles && errors.jobRoles && (
                      <FormHelperText error id="job-roles-helper">
                        {errors.jobRoles}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="languages">Languages</InputLabel>
                    <Autocomplete
                      id="languages"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={languages}
                      value={values.languages ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setLanguagesInputText('');
                        } else {
                          setFieldValue('languages', newValue);
                        }
                      }}
                      inputValue={languagesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setLanguagesInputText('');
                        } else if (reason !== 'reset') {
                          setLanguagesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select languages"
                          name="languages"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.languages && errors.languages && (
                      <FormHelperText error id="languages-helper">
                        {errors.languages}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="countries">Countries</InputLabel>
                    <Autocomplete
                      id="countries"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={countries}
                      value={values.countries ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setCountriesInputText('');
                        } else {
                          setFieldValue('countries', newValue);
                        }
                      }}
                      inputValue={countriesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setCountriesInputText('');
                        } else if (reason !== 'reset') {
                          setCountriesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select countries"
                          name="countries"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.countries && errors.countries && (
                      <FormHelperText error id="countries-helper">
                        {errors.countries}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="company-stages">Company Stages</InputLabel>
                    <Autocomplete
                      id="company-stages"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={companyStages}
                      value={values.companyStages ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setCompanyStagesInputText('');
                        } else {
                          setFieldValue('companyStages', newValue);
                        }
                      }}
                      inputValue={companyStagesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setCompanyStagesInputText('');
                        } else if (reason !== 'reset') {
                          setCompanyStagesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select company stages"
                          name="companyStages"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.companyStages && errors.companyStages && (
                      <FormHelperText error id="company-stages-helper">
                        {errors.companyStages}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>

                    <InputLabel htmlFor="financing-stages">Financing Stages</InputLabel>
                    <Autocomplete
                      id="financing-stages"
                      multiple
                      fullWidth
                      disableCloseOnSelect
                      options={financingStages}
                      value={values.financingStages ?? []}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option?.label}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          setFinancingStagesInputText('');
                        } else {
                          setFieldValue('financingStages', newValue);
                        }
                      }}
                      inputValue={financingStagesInputText}
                      onInputChange={(event, value, reason) => {
                        if (event && event.type === 'blur') {
                          setFinancingStagesInputText('');
                        } else if (reason !== 'reset') {
                          setFinancingStagesInputText(value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select financing stages"
                          name="financingStages"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password'
                          }}
                        />
                      )}
                    />
                    {touched.financingStages && errors.financingStages && (
                      <FormHelperText error id="financing-stages-helper">
                        {errors.financingStages}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
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

export default ProfileExpertisePage;
