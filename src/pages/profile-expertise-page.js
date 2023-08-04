// material-ui
import industries from 'data/industries';
import jobClusters from 'data/jobClusters';
import jobRoles from 'data/jobRoles';
import languages from 'data/languages';
import countries from 'data/countries';
import companyStages from 'data/companyStages';
import financingStages from 'data/financingStages';
import { FormattedMessage } from 'react-intl';

import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfoWrapper from 'components/InfoWrapper';

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
  const personalInformation = useSelector(state => state.personalInformation);
  const [expertise, setExpertise] = useState(null);
  const [industriesInputText, setIndustriesInputText] = useState('');
  const [jobRolesInputText, setJobRolesInputText] = useState('');
  
  const bindExpertise = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/expertise',
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

  let currentYear = new Date().getFullYear();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title={<FormattedMessage id="expertise_title"></FormattedMessage>} >
          <FormattedMessage id="expertise_description"></FormattedMessage>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false} sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              industries: expertise?.industries ? industries.filter(x => expertise.industries.find(y => x.code === y)) : null,
              jobClusters: expertise?.jobClusters ? jobClusters.filter(x => expertise.jobClusters.find(y => x.code === y)) : null,
              jobRoles: expertise?.jobRoles ? jobRoles.filter(x => expertise.jobRoles.find(y => x.code === y)) : null,
              languages: expertise?.languages ? languages.filter(x => expertise.languages.find(y => x.code === y)) : null,
              countries: expertise?.countries ? countries.filter(x => expertise.countries.find(y => x.code === y)) : null,
              companyStages: expertise?.companyStages ? companyStages.filter(x => expertise.companyStages.find(y => x.code === y)) : null,
              financingStages: expertise?.financingStages ? financingStages.filter(x => expertise.financingStages.find(y => x.code === y)) : null,
              startYear: expertise?.startYear,
              submit: null
            }}
            validationSchema={Yup.object().shape({
              industries: Yup.array().of(Yup.object()).nullable(true),
              jobClusters: Yup.array().of(Yup.object()).nullable(true),
              jobRoles: Yup.array().of(Yup.object()).nullable(true),
              languages: Yup.array().of(Yup.object()).nullable(true),
              countries: Yup.array().of(Yup.object()).nullable(true),
              companyStages: Yup.array().of(Yup.object()).nullable(true),
              financingStages: Yup.array().of(Yup.object()).nullable(true),
              startYear: Yup.number("Should be a year between 1950 and " + currentYear).integer("Should be a year between 1950 and " + currentYear).min(1950, "Should be a year between 1950 and " + currentYear).max(currentYear, "Should be a year between 1950 and " + currentYear).nullable(true)
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                var body = {
                  industries: values?.industries?.map(x => x.code),
                  jobClusters: values?.jobClusters?.map(x => x.code),
                  jobRoles: values?.jobRoles?.map(x => x.code),
                  languages: values?.languages?.map(x => x.code),
                  countries: values?.countries?.map(x => x.code),
                  companyStages: values?.companyStages?.map(x => x.code),
                  financingStages: values?.financingStages?.map(x => x.code),
                  startYear: values?.startYear
                }
                let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/expertise',
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
                    message: 'Saved.',
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
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Box sx={{ p: 2.5 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="expertise_industries_tooltip">
                          <InputLabel htmlFor="industries">Industries</InputLabel>
                        </InfoWrapper>

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
                              if (industriesInputText)
                                setIndustriesInputText('');
                              else
                                setFieldValue('industries', null);
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
                        <InfoWrapper tooltipText="expertise_job_clusters_tooltip">
                          <InputLabel htmlFor="job-clusters">Job Clusters</InputLabel>
                        </InfoWrapper>

                        <Autocomplete
                          id="job-clusters"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={jobClusters}
                          value={values.jobClusters ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('jobClusters', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select job clusters"
                              name="jobClusters"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.jobClusters && errors.jobClusters && (
                          <FormHelperText error id="job-clusters-helper">
                            {errors.jobClusters}
                          </FormHelperText>
                        )}

                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="expertise_job_roles_tooltip">
                          <InputLabel htmlFor="job-roles">Job Roles</InputLabel>
                        </InfoWrapper>

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
                              if (jobRolesInputText)
                                setJobRolesInputText('');
                              else
                                setFieldValue('jobRoles', null);
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
                        <InfoWrapper tooltipText="expertise_languages_tooltip">
                          <InputLabel htmlFor="languages">Languages (full professional proficiency)</InputLabel>
                        </InfoWrapper>

                        <Autocomplete
                          id="languages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={languages}
                          value={values.languages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('languages', newValue);
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
                        <InfoWrapper tooltipText="expertise_countries_tooltip">
                          <InputLabel htmlFor="countries">Countries</InputLabel>
                        </InfoWrapper>

                        <Autocomplete
                          id="countries"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={countries}
                          value={values.countries ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('countries', newValue);
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
                        <InfoWrapper tooltipText="expertise_company_stages_tooltip">
                          <InputLabel htmlFor="company-stages">Company Stages</InputLabel>
                        </InfoWrapper>

                        <Autocomplete
                          id="company-stages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={companyStages}
                          value={values.companyStages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('companyStages', newValue);
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
                        <InfoWrapper tooltipText="expertise_financing_stages_tooltip">
                          <InputLabel htmlFor="financing-stages">Financing Stages</InputLabel>
                        </InfoWrapper>

                        <Autocomplete
                          id="financing-stages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={financingStages}
                          value={values.financingStages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('financingStages', newValue);
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
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="expertise_start_year_tooltip">
                          <InputLabel htmlFor="start-year">Start Year</InputLabel>
                        </InfoWrapper>

                        <TextField
                          fullWidth
                          id="start-year"
                          type="number"
                          inputProps={{ min: 1950, max: currentYear }}
                          placeholder="Enter Start Year"
                          value={normalizeInputValue(values.startYear)}
                          name="startYear"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.startYear && errors.startYear && (
                          <FormHelperText error id="start-year-helper">
                            {errors.startYear}
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
      </Grid>
    </Grid>
  );
};

export default ProfileExpertisePage;
