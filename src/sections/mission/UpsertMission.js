import PropTypes from 'prop-types';
import {  useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Autocomplete,
  FormHelperText,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Select,
  ListItemText,
  MenuItem
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';
import Avatar from 'components/@extended/Avatar';

// assets
import { CameraOutlined } from '@ant-design/icons';
import { normalizeInputValue, normalizeNullableInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

import countries from 'data/countries';
import languages from 'data/languages';
import jobRoles from 'data/jobRoles';
import industries from 'data/industries';
const avatarImage = require.context('assets/images/missions', true);

// constant
const getInitialValues = (mission) => {
  const newMission = {
    id: null,
    employerId: null,
    title: null,
    description: null,
    role: null,
    alternativeRoles: null,
    industry: null,
    alternativeIndustries: null,
    requiredLanguages: null,
    yearsExperience: null,
    outcome: null,
    country: null,
    startDate: null,
    endDate: null,
    effortHours: null
  };
  
  if (mission) {
    var result = _.merge({}, newMission, mission);

    if (mission.alternativeRoles)
      result.alternativeRoles = jobRoles.filter(x => mission.alternativeRoles.find(y => x.code === y));

    if (mission.alternativeIndustries)
      result.alternativeIndustries = industries.filter(x => mission.alternativeIndustries.find(y => x.code === y));

    if (mission.requiredLanguages)
      result.requiredLanguages = languages.filter(x => mission.requiredLanguages.find(y => x.code === y));

    return result;
  }

  return newMission;
};

// ==============================|| MISSION ADD / EDIT / DELETE ||============================== //

const UpsertMission = ({ missionId }) => {
  const { keycloak } = useKeycloak();
  const [mission, setMission] = useState(null);
  const [employers, setEmployers] = useState([]);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [alternativeRolesInputText, setAlternativeRolesInputText] = useState('');
  const [alternativeIndustriesInputText, setAlternativeIndustriesInputText] = useState('');
  const [requiredLanguagesInputText, setRequiredLanguagesInputText] = useState('');

  const [avatar, setAvatar] = useState(mission?.mainImageUrl ? mission.mainImageUrl : avatarImage('./default.png'));
  const theme = useTheme();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const bindMission = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + missionId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMission(json.mission);
    } catch (error) {
      console.log(error);
    }
  };

  const bindEmployers = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers?userName=' + encodeURIComponent(keycloak.idTokenParsed.preferred_username),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployers(json.employers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      bindEmployers();
      if (missionId) {
        await bindMission();
      }
    })();
  }, []);

  const dispatch = useDispatch();

  const MissionSchema = Yup.object().shape({
    employerId: Yup.string().required('Employer is required').nullable(true),
    title: Yup.string().max(255).required('Title is required').nullable(true),
    description: Yup.string().max(2000).required('Description is required').nullable(true),
    role: Yup.string().max(255).required('Role is required').nullable(true),
    alternativeRoles: Yup.array().of(Yup.object()).nullable(true),
    industry: Yup.string().max(255).required('Industry is required').nullable(true),
    alternativeIndustries: Yup.array().of(Yup.object()).nullable(true),
    requiredLanguages: Yup.array().of(Yup.object()).nullable(true),
    yearsExperience: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(100, "Maximum 100").nullable(true),
    outcome: Yup.string().max(1000).nullable(true),
    country: Yup.string().required('Country is required').nullable(true),
    startDate: Yup.string().required('Start Date is required').nullable(true),
    endDate: Yup.string().nullable(true),
    effortHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(10000000, "Maximum 10000000").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(mission),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        body.alternativeRoles = values?.alternativeRoles?.map(x => x.code);
        body.alternativeIndustries = values?.alternativeIndustries?.map(x => x.code);
        body.requiredLanguages = values?.requiredLanguages?.map(x => x.code);

        if (mission) {

          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + mission.id,
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
            setSubmitting(false);
            return;
          }

          navigate('/missions/my');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Mission updated.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        } else {
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions',
            {
              method: 'POST',
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
                message: 'Adding a mission failed.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
            setSubmitting(false);
            return;
          }

          navigate('/missions/my');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Mission created.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        }

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            {!mission && 
              <>
                <DialogTitle>Create Mission</DialogTitle>
                <Divider />
              </>  
            }
            
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={1}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-title">Employer</InputLabel>

                        <Select
                          id="employerId"
                          name="employerId"
                          displayEmpty
                          value={normalizeInputValue(values.employerId)}
                          onChange={handleChange}
                          size="small"
                        >
                          {employers.map((employer) => (
                            <MenuItem key={employer.id} value={employer.id}>
                              <ListItemText primary={employer.name} />
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.employerId && errors.employerId && (
                          <FormHelperText error id="mission-employer-id-helper">
                            {errors.employerId}
                          </FormHelperText>
                        )}

                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-title">Title</InputLabel>
                        <TextField
                          fullWidth
                          id="mission-title"
                          placeholder="Enter Mission Title"
                          value={normalizeInputValue(values.title)}
                          name="title"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.title && errors.title && (
                          <FormHelperText error id="mission-title-helper">
                            {errors.title}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-description">Description</InputLabel>
                        <TextField
                          multiline
                          rows="5"
                          fullWidth
                          id="mission-description"
                          placeholder="Enter Mission Description"
                          value={normalizeInputValue(values.description)}
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.description && errors.description && (
                          <FormHelperText error id="mission-description-helper">
                            {errors.description}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-role">Role</InputLabel>
                        <Autocomplete
                          id="mission-role"
                          fullWidth
                          options={jobRoles}
                          value={values?.role ? jobRoles.filter((item) => item.code === values?.role)[0] : null}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          onChange={(event, newValue) => {
                            setFieldValue('role', newValue === null ? '' : newValue.code);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select role"
                              name="role"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.role && errors.role && (
                          <FormHelperText error id="mission-role-helper">
                            {errors.role}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-alternative-roles">Alternative Roles</InputLabel>
                        <Autocomplete
                          id="mission-alternative-roles"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={jobRoles}
                          value={values?.alternativeRoles ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue, reason) => {
                            if (reason === 'clear') {
                              if (alternativeRolesInputText)
                                setAlternativeRolesInputText('');
                              else
                                setFieldValue('alternativeRoles', null);
                            } else {
                              setFieldValue('alternativeRoles', newValue);
                            }
                          }}
                          inputValue={alternativeRolesInputText}
                          onInputChange={(event, value, reason) => {
                            if (event && event.type === 'blur') {
                              setAlternativeRolesInputText('');
                            } else if (reason !== 'reset') {
                              setAlternativeRolesInputText(value);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select alternative roles"
                              name="alternativeRoles"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.alternativeRoles && errors.alternativeRoles && (
                          <FormHelperText error id="mission-alternative-roles-helper">
                            {errors.alternativeRoles}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-industry">Industry</InputLabel>
                        <Autocomplete
                          id="mission-industry"
                          fullWidth
                          options={industries}
                          value={values?.industry ? industries.filter((item) => item.code === values?.industry)[0] : null}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          onChange={(event, newValue) => {
                            setFieldValue('industry', newValue === null ? '' : newValue.code);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select industry"
                              name="industry"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.industry && errors.industry && (
                          <FormHelperText error id="mission-industry-helper">
                            {errors.industry}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-alternative-industries">Alternative Industries</InputLabel>
                        <Autocomplete
                          id="mission-alternative-industries"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={industries}
                          value={values?.alternativeIndustries ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue, reason) => {
                            if (reason === 'clear') {
                              if (alternativeIndustriesInputText)
                                setAlternativeIndustriesInputText('');
                              else
                                setFieldValue('alternativeIndustries', null);
                            } else {
                              setFieldValue('alternativeIndustries', newValue);
                            }
                          }}
                          inputValue={alternativeIndustriesInputText}
                          onInputChange={(event, value, reason) => {
                            if (event && event.type === 'blur') {
                              setAlternativeIndustriesInputText('');
                            } else if (reason !== 'reset') {
                              setAlternativeIndustriesInputText(value);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select alternative industries"
                              name="alternativeIndustries"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.alternativeIndustries && errors.alternativeIndustries && (
                          <FormHelperText error id="mission-alternative-industries-helper">
                            {errors.alternativeIndustries}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-required-languages">Required Languages</InputLabel>
                        <Autocomplete
                          id="mission-required-languages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={languages}
                          value={values.requiredLanguages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue, reason) => {
                            if (reason === 'clear') {
                              if (requiredLanguagesInputText)
                                setRequiredLanguagesInputText('');
                              else
                                setFieldValue('requiredLanguages', null);
                            } else {
                              setFieldValue('requiredLanguages', newValue);
                            }
                          }}
                          inputValue={requiredLanguagesInputText}
                          onInputChange={(event, value, reason) => {
                            if (event && event.type === 'blur') {
                              setRequiredLanguagesInputText('');
                            } else if (reason !== 'reset') {
                              setRequiredLanguagesInputText(value);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select required languages"
                              name="requiredLanguages"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.requiredLanguages && errors.requiredLanguages && (
                          <FormHelperText error id="mission-required-languages-helper">
                            {errors.requiredLanguages}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-years-experience">Years Experience</InputLabel>
                        <TextField
                          fullWidth
                          id="mission-years-experience"
                          type="number"
                          placeholder="Enter Mission Years Experience"
                          value={normalizeInputValue(values.yearsExperience)}
                          name="yearsExperience"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.yearsExperience && errors.yearsExperience && (
                          <FormHelperText error id="mission-years-experience-helper">
                            {errors.yearsExperience}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-outcome">Outcome</InputLabel>
                        <TextField
                          multiline
                          rows="5"
                          fullWidth
                          id="mission-outcome"
                          placeholder="Enter Mission Outcome"
                          value={normalizeInputValue(values.outcome)}
                          name="outcome"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.outcome && errors.outcome && (
                          <FormHelperText error id="mission-outcome-helper">
                            {errors.outcome}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-country">Country</InputLabel>
                        <Autocomplete
                          id="mission-country"
                          fullWidth
                          value={values?.country ? countries.filter((item) => item.code === values?.country)[0] : null}
                          onBlur={handleBlur}
                          onChange={(event, newValue) => {
                            setFieldValue('country', newValue === null ? '' : newValue.code);
                          }}
                          options={countries}
                          autoHighlight
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          getOptionLabel={(option) => option.label}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option.code && (
                                <img
                                  loading="lazy"
                                  width="20"
                                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                  alt=""
                                />
                              )}
                              {option.label}
                              {option.code && ` (${option.code})`}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Choose a country"
                              name="country"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.country && errors.country && (
                          <FormHelperText error id="mission-country-helper">
                            {errors.country}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-start-date">Start Date</InputLabel>
                        <DesktopDatePicker
                          value={normalizeNullableInputValue(values.startDate)}
                          inputFormat="yyyy-MM-dd"
                          onChange={(date) => {
                            setFieldValue('startDate', date);
                          }}
                          renderInput={(props) =>
                            <>
                              <TextField
                                fullWidth
                                {...props}
                                placeholder="Start Date"
                                name="startDate"
                              />
                              {touched.startDate && errors.startDate && (
                                <FormHelperText error id="mission-start-date-helper">
                                  {errors.startDate}
                                </FormHelperText>
                              )}
                            </>
                          }
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-end-date">End Date</InputLabel>
                        <DesktopDatePicker
                          value={normalizeNullableInputValue(values.endDate)}
                          inputFormat="yyyy-MM-dd"
                          onChange={(date) => {
                            setFieldValue('endDate', date);
                          }}
                          renderInput={(props) =>
                            <>
                              <TextField fullWidth {...props} placeholder="End Date" name="endDate" />
                              {touched.endDate && errors.endDate && (
                                <FormHelperText error id="mission-end-date-helper">
                                  {errors.endDate}
                                </FormHelperText>
                              )}
                            </>
                          }
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-effort-hours">Effort Hours</InputLabel>
                        <TextField
                          fullWidth
                          id="mission-effort-hours"
                          type="number"
                          inputProps={{min: 0, max: 1000000}}
                          placeholder="Enter Mission Effort Hours"
                          value={normalizeInputValue(values.effortHours)}
                          name="effortHours"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.effortHours && errors.effortHours && (
                          <FormHelperText error id="mission-effort-hours-helper">
                            {errors.effortHours}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button color="error" onClick={() => { navigate('/missions/my'); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {mission ? 'Update' : 'Create'}
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

UpsertMission.propTypes = {
  missionId: PropTypes.any
};

export default UpsertMission;
