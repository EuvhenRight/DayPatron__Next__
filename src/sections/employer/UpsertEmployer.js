import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import Avatar from 'components/@extended/Avatar';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined } from '@ant-design/icons';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import industries from 'data/industries';
import countries from 'data/countries';
import { useKeycloak } from '@react-keycloak/web';

const avatarImage = require.context('assets/images/companies', true);

// constant
const getInitialValues = (employer) => {
  const newEmployer = {
    id: null,
    name: null,
    email: null,
    country: null,
    industry: null,
    chamberOfCommerceIdentifier: null,
    linkedInUrl: null
  };

  if (employer) {
    var result = _.merge({}, newEmployer, employer);
    return result;
  }

  return newEmployer;
};

// ==============================|| EMPLOYER ADD / EDIT / DELETE ||============================== //

const UpsertEmployer = ({ employerId }) => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [employer, setEmployer] = useState(null);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [newMainImage, setNewMainImage] = useState(undefined);

  const [avatar, setAvatar] = useState(employer?.logoImageUrl ? employer.logoImageUrl : avatarImage('./default.png'));
  const theme = useTheme();

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
    handleMainImageUrlChange(employer?.mainImageUrl);
  }, [employer?.mainImageUrl]);

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

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + encodeURIComponent(employer.id) + '/main-images',
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
      var newEmployer = { ...employer };
      newEmployer.mainImageUrl = json.mainImageUrl;

      setEmployer(newEmployer);

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

  const bindEmployer = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + employerId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployer(json.employer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (employerId) {
        await bindEmployer();
      }
    })();
  }, []);

  const dispatch = useDispatch();

  const EmployerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required').nullable(true),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email').nullable(true),
    country: Yup.string().nullable(true),
    industry: Yup.string().required('Industry is required').nullable(true),
    chamberOfCommerceIdentifier: Yup.string().max(50).nullable(true),
    linkedInUrl: Yup.string().max(255).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(employer),
    validationSchema: EmployerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (employer) {

          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + employer.id,
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

          navigate('/companies/my');

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

        } else {
          values.employerUserId = personalInformation.id;
          var body = prepareApiBody(values);
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers',
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
                message: 'Adding a company failed.',
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

          navigate('/companies/my');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Company created.',
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
            <DialogTitle>{employer ? 'Update Company' : 'Create Company'}</DialogTitle>
            <Divider />
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
                      <Avatar src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
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
                        <InputLabel htmlFor="employer-name">Legal Entity Name</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-name"
                          placeholder="Enter legal entity name"
                          value={normalizeInputValue(values.name)}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.name && errors.name && (
                          <FormHelperText error id="employer-name-helper">
                            {errors.name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-email">General Email Box</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-email"
                          placeholder="Enter general email box"
                          value={normalizeInputValue(values.email)}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="employer-email-helper">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-country">Country</InputLabel>
                        <Autocomplete
                          id="employer-country"
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
                              placeholder="Select a country"
                              name="country"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.country && errors.country && (
                          <FormHelperText error id="employer-country-helper">
                            {errors.country}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-industry">Industry</InputLabel>
                        <Autocomplete
                          id="employer-industry"
                          fullWidth
                          value={values?.industry ? industries.filter((item) => item.code === values?.industry)[0] : null}
                          onBlur={handleBlur}
                          onChange={(event, newValue) => {
                            setFieldValue('industry', newValue === null ? '' : newValue.code);
                          }}
                          options={industries}
                          autoHighlight
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          getOptionLabel={(option) => option.label}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.label}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select an industry"
                              name="industry"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.industry && errors.industry && (
                          <FormHelperText error id="employer-industry-helper" sx={{ pl: 1.75 }}>
                            {errors.orderStatus}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-coc-identifier">Chamber of Commerce Number</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-coc-identifier"
                          placeholder="Enter chamber of commerce number"
                          value={normalizeInputValue(values.chamberOfCommerceIdentifier)}
                          name="chamberOfCommerceIdentifier"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.chamberOfCommerceIdentifier && errors.chamberOfCommerceIdentifier && (
                          <FormHelperText error id="employer-coc-identifier-helper">
                            {errors.chamberOfCommerceIdentifier}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-linkedin-url">Company LinkedIn Page</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-linkedin-url"
                          placeholder="Enter LinkedIn page"
                          value={normalizeInputValue(values.linkedInUrl)}
                          name="linkedInUrl"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.linkedInUrl && errors.linkedInUrl && (
                          <FormHelperText error id="employer-linkedin-url-helper">
                            {errors.linkedInUrl}
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
                <Button color="error" onClick={() => { navigate('/companies/my'); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Save
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

UpsertEmployer.propTypes = {
  employerId: PropTypes.any
};

export default UpsertEmployer;
