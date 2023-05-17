import PropTypes from 'prop-types';
import {  useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Autocomplete,
  Chip,
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
  Tooltip,
  Typography,
  Checkbox
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertMissionDelete from './AlertMissionDelete';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';
import Avatar from 'components/@extended/Avatar';

// assets
import { CameraOutlined, DeleteFilled, CloseOutlined } from '@ant-design/icons';
import { normalizeInputValue, normalizeNullableInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

import countries from 'data/countries';
import languages from 'data/languages';
const avatarImage = require.context('assets/images/missions', true);

// constant
const getInitialValues = (mission) => {
  const newMission = {
    id: null,
    title: null,
    description: null
  };

  if (mission) {
    newMission.id = mission.id;
    newMission.title = mission.title;
    newMission.description = mission.description;
    var result = _.merge({}, newMission, mission);
    return result;
  }

  return newMission;
};

// ==============================|| MISSION ADD / EDIT / DELETE ||============================== //

const UpsertMission = ({ missionId }) => {
  const { keycloak } = useKeycloak();
  const [openAlert, setOpenAlert] = useState(false);
  const [mission, setMission] = useState(null);
  const [isCreating, setIsCreating] = useState(true);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(mission?.mainImageUrl ? mission.mainImageUrl : avatarImage('./default.png'));
  const theme = useTheme();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
  };

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

  useEffect(() => {
    (async () => {
      if (missionId) {
        setIsCreating(false);
        await bindMission();
      }
    })();
  }, []);

  const dispatch = useDispatch();

  const MissionSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required').nullable(true),
    description: Yup.string().max(255).required('Description is required').nullable(true),
    role: Yup.string().max(255).required('Role is required').nullable(true),
    outcome: Yup.string().max(1000).nullable(true),
    country: Yup.string().nullable(true),
    yearsExperience: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(100, "Maximum 100").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(mission),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      try {
        if (mission) {

          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + mission.id,
            {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: prepareApiBody(values)
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
          values.employerId = '645cafabecf7911bcc5a02cf';
          var body = prepareApiBody(values);
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions',
            {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: body
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
            <DialogTitle>{mission ? 'Update Mission' : 'Create Mission'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
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
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
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
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
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
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-role">Role</InputLabel>
                        <TextField
                          fullWidth
                          id="mission-role"
                          placeholder="Enter Mission Role"
                          value={normalizeInputValue(values.role)}
                          name="role"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.role && errors.role)}
                          helperText={touched.role && errors.role}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-outcome">Outcome</InputLabel>
                        <TextField
                          fullWidth
                          id="mission-outcome"
                          placeholder="Enter Mission Outcome"
                          value={normalizeInputValue(values.outcome)}
                          name="outcome"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.outcome && errors.outcome)}
                          helperText={touched.outcome && errors.outcome}
                        />
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
                          error={Boolean(touched.yearsExperience && errors.yearsExperience)}
                          helperText={touched.yearsExperience && errors.yearsExperience}
                        />
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
                          renderInput={(props) => <TextField fullWidth {...props} placeholder="Start Date" />}
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
                          renderInput={(props) => <TextField fullWidth {...props} placeholder="End Date" />}
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
                          error={Boolean(touched.effortHours && errors.effortHours)}
                          helperText={touched.effortHours && errors.effortHours}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="mission-languages">Languages</InputLabel>
                        <Autocomplete
                          id="mission-languages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={languages}
                          value={values.languages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, newValue) => {
                            setFieldValue('languages', newValue);
                          }}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox style={{ marginRight: 8 }} checked={selected} />
                              {option.label}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select languages"
                              name="languages"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                key={index}
                                {...getTagProps({ index })}
                                variant="combined"
                                label={option.label}
                                deleteIcon={<CloseOutlined style={{ fontSize: '0.75rem' }} />}
                                sx={{ color: 'text.primary' }}
                              />
                            ))
                          }
                        />
                        {touched.languages && errors.languages && (
                          <FormHelperText error id="mission-languages">
                            {errors.languages}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="Delete Mission" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={() => { navigate('/missions/my'); } }>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {mission ? 'Update' : 'Create'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertMissionDelete mission={mission} open={openAlert} handleClose={handleAlertClose} onArchive={() => { navigate('/missions/my'); } } />}
    </>
  );
};

UpsertMission.propTypes = {
  missionId: PropTypes.any
};

export default UpsertMission;
