import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InfoWrapper from 'components/InfoWrapper';

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
  MenuItem,
  Switch
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
import { normalizeInputValue, normalizeNullableInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

import countries from 'data/countries';
import languages from 'data/languages';
import jobRoles from 'data/jobRoles';
import jobClusters from 'data/jobClusters';
import industries from 'data/industries';
const avatarImage = require.context('assets/images/missions', true);

// constant
const getInitialValues = (mission) => {
  const newMission = {
    id: null,
    employerId: null,
    title: null,
    hideEmployerName: null,
    description: null,
    cluster: null,
    role: null,
    alternativeRoles: null,
    industry: null,
    alternativeIndustries: null,
    requiredLanguages: null,
    yearsExperience: null,
    currentSetup: null,
    whyWeNeedYou: null,
    outcome: null,
    profileType: null,
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
  const personalInformation = useSelector(state => state.personalInformation);
  const [mission, setMission] = useState(null);
  const [employers, setEmployers] = useState([]);
  const navigate = useNavigate();
  const [alternativeRolesInputText, setAlternativeRolesInputText] = useState('');
  const [alternativeIndustriesInputText, setAlternativeIndustriesInputText] = useState('');

  const [uploading, setUploading] = useState(false);
  const [newMainImage, setNewMainImage] = useState(undefined);
  const [avatar, setAvatar] = useState(mission?.mainImageUrl ? mission.mainImageUrl : avatarImage('./default.png'));
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleMainImageUrlChange = async (newMainImageUrl) => {
    try {
      if (!newMainImageUrl) {
        setAvatar(avatarImage(`./default.png`));
        return;
      }

      let response = await fetch(newMainImageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();
      var avatarSrc = URL.createObjectURL(imageBlob);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMainImageUrlChange(mission?.mainImageUrl);
  }, [mission?.mainImageUrl]);

  const handleChangeMainImage = (event) => {
    var newImage = event.target.files?.[0];
    if (newImage) {
      setNewMainImage(newImage);
      var avatarSrc = URL.createObjectURL(newImage);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    }
  };

  const handleUploadClick = async () => {

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("mainImage", newMainImage);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(mission.id) + '/main-images',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          },
          body: formData
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Upload failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );

        return;
      }

      let json = await response.json();
      var newMission = { ...mission };
      newMission.mainImageUrl = json.mainImageUrl;

      setMission(newMission);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Image uploaded.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Upload failed.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      console.log(err);
    }

    setUploading(false);
    setNewMainImage(null);
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

      setMission(json);
    } catch (error) {
      console.log(error);
    }
  };

  const bindEmployers = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers?employerUserId=' + encodeURIComponent(personalInformation.id),
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
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (missionId) {
        await bindMission();
      }
    })();
  }, [employers]);

  const MissionSchema = Yup.object().shape({
    employerId: Yup.string().required('Company is required').nullable(true),
    title: Yup.string().max(255).required('Title is required').nullable(true),
    hideEmployerName: Yup.boolean().nullable(true),
    description: Yup.string().max(2000).required('Description is required').nullable(true),
    cluster: Yup.string().max(255).required('Cluster is required').nullable(true),
    role: Yup.string().max(255).required('Role is required').nullable(true),
    alternativeRoles: Yup.array().of(Yup.object()).nullable(true),
    industry: Yup.string().max(255).required('Industry is required').nullable(true),
    alternativeIndustries: Yup.array().of(Yup.object()).nullable(true),
    requiredLanguages: Yup.array().of(Yup.object()).nullable(true),
    yearsExperience: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(100, "Maximum 100").nullable(true),
    currentSetup: Yup.string().max(1000).nullable(true),
    whyWeNeedYou: Yup.string().max(1000).nullable(true),
    outcome: Yup.string().max(1000).nullable(true),
    profileType: Yup.string().max(1000).nullable(true),
    country: Yup.string().required('Country is required').nullable(true),
    startDate: Yup.string().required('Start Date is required').nullable(true),
    endDate: Yup.string().nullable(true),
    effortHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(168, "Maximum 168").nullable(true)
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
                  <Stack spacing={2.5} alignItems="center">
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
                      onChange={handleChangeMainImage}
                    />

                    {newMainImage &&
                      <Stack alignItems="center" spacing={2}>
                        <Button onClick={handleUploadClick} variant="contained" disabled={uploading}>
                          {!uploading && <>Upload</>}
                          {uploading && <>Uploading...</>}
                        </Button>
                      </Stack>
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_company_tooltip">
                          <InputLabel htmlFor="mission-title">Company</InputLabel>
                        </InfoWrapper>

                        <Select
                          id="employerId"
                          name="employerId"
                          displayEmpty
                          value={normalizeInputValue(values.employerId)}
                          onChange={handleChange}
                        >
                          {employers.map((employer) => (
                            <MenuItem key={employer.id} value={employer.id}>
                              {employer.name}
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
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_title_tooltip">
                          <InputLabel htmlFor="mission-title">Mission Title</InputLabel>
                        </InfoWrapper>
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
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_hide_company_name_tooltip">
                          <InputLabel htmlFor="mission-hide-company-name">Hide Company Name</InputLabel>
                        </InfoWrapper>
                        <Switch
                          id="mission-hide-company-name"
                          name="hideEmployerName"
                          checked={normalizeBooleanInputValue(values?.hideEmployerName)}
                          onChange={(event, checked) => {
                            setFieldValue("hideEmployerName", checked);
                          }}
                        />
                        {touched.hideEmployerName && errors.hideEmployerName && (
                          <FormHelperText error id="mission-hide-company-name-helper">
                            {errors.hideEmployerName}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_description_tooltip">
                          <InputLabel htmlFor="mission-description">Description</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="mission-description"
                          value={normalizeInputValue(values.description)}
                          onChange={(e) => setFieldValue('description', e)}
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
                        <InfoWrapper tooltipText="mission_cluster_tooltip">
                          <InputLabel htmlFor="mission-cluster">Cluster</InputLabel>
                        </InfoWrapper>
                        <Autocomplete
                          id="mission-cluster"
                          fullWidth
                          options={jobClusters}
                          value={values?.cluster ? jobClusters.find((item) => item.code === values?.cluster) : null}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          onChange={(event, newValue) => {
                            setFieldValue('cluster', newValue === null ? '' : newValue.code);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select cluster"
                              name="cluster"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.cluster && errors.cluster && (
                          <FormHelperText error id="mission-cluster-helper">
                            {errors.cluster}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_role_tooltip">
                          <InputLabel htmlFor="mission-role">Role</InputLabel>
                        </InfoWrapper>
                        <Autocomplete
                          id="mission-role"
                          fullWidth
                          options={jobRoles}
                          value={values?.role ? jobRoles.find((item) => item.code === values?.role) : null}
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
                        <InfoWrapper tooltipText="mission_alternative_roles_tooltip">
                          <InputLabel htmlFor="mission-alternative-roles">Alternative Roles</InputLabel>
                        </InfoWrapper>
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
                        <InfoWrapper tooltipText="mission_industry_tooltip">
                          <InputLabel htmlFor="mission-industry">Industry</InputLabel>
                        </InfoWrapper>
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
                        <InfoWrapper tooltipText="mission_alternative_industries_tooltip">
                          <InputLabel htmlFor="mission-alternative-industries">Alternative Industries</InputLabel>
                        </InfoWrapper>
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
                        <InfoWrapper tooltipText="mission_required_languages_tooltip">
                          <InputLabel htmlFor="mission-required-languages">Required Languages</InputLabel>
                        </InfoWrapper>
                        <Autocomplete
                          id="mission-required-languages"
                          multiple
                          fullWidth
                          disableCloseOnSelect
                          options={languages}
                          value={values.requiredLanguages ?? []}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          onChange={(event, newValue) => {
                            setFieldValue('requiredLanguages', newValue);
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
                        <InfoWrapper tooltipText="mission_years_experience_tooltip">
                          <InputLabel htmlFor="mission-years-experience">Years Experience</InputLabel>
                        </InfoWrapper>
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
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_start_date_tooltip">
                          <InputLabel htmlFor="mission-start-date">Start Date</InputLabel>
                        </InfoWrapper>
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
                        <InfoWrapper tooltipText="mission_end_date_tooltip">
                          <InputLabel htmlFor="mission-end-date">End Date</InputLabel>
                        </InfoWrapper>
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

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_country_tooltip">
                          <InputLabel htmlFor="mission-country">Country</InputLabel>
                        </InfoWrapper>
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
                        <InfoWrapper tooltipText="mission_hours_per_week_tooltip">
                          <InputLabel htmlFor="mission-effort-hours">Indicative Number of Hours per Week</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="mission-effort-hours"
                          type="number"
                          inputProps={{ min: 0, max: 1000000 }}
                          placeholder="Enter indicative number of hours per week"
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
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_current_setup_tooltip">
                          <InputLabel htmlFor="mission-current-setup">Current Setup</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="mission-current-setup"
                          value={normalizeInputValue(values.currentSetup)}
                          onChange={(e) => setFieldValue('currentSetup', e)}
                        />
                        {touched.currentSetup && errors.currentSetup && (
                          <FormHelperText error id="mission-current-setup-helper">
                            {errors.currentSetup}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_why_we_need_you_tooltip">
                          <InputLabel htmlFor="mission-why-we-need-you">Why We Need You</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="mission-why-we-need-you"
                          value={normalizeInputValue(values.whyWeNeedYou)}
                          onChange={(e) => setFieldValue('whyWeNeedYou', e)}
                        />
                        {touched.whyWeNeedYou && errors.whyWeNeedYou && (
                          <FormHelperText error id="mission-why-we-need-you-helper">
                            {errors.whyWeNeedYou}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_outcome_tooltip">
                          <InputLabel htmlFor="mission-outcome">Outcome</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="mission-outcome"
                          value={normalizeInputValue(values.outcome)}
                          onChange={(e) => setFieldValue('outcome', e)}
                        />
                        {touched.outcome && errors.outcome && (
                          <FormHelperText error id="mission-outcome-helper">
                            {errors.outcome}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="mission_profile_we_are_looking_for_tooltip">
                          <InputLabel htmlFor="mission-profile-type">Profile We Are Looking For</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="mission-profile-type"
                          value={normalizeInputValue(values.profileType)}
                          onChange={(e) => setFieldValue('profileType', e)}
                        />
                        {touched.profileType && errors.profileType && (
                          <FormHelperText error id="mission-profile-type-helper">
                            {errors.profileType}
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
