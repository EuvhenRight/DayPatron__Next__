import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
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
  Tooltip,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertEmployerDelete from './AlertEmployerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import industries from 'data/industries';

const avatarImage = require.context('assets/images/companies', true);

// constant
const getInitialValues = (employer) => {
  const newEmployer = {
    id: null,
    name: null,
    email: null,
    industry: null,
    chamberOfCommerceIdentifier: null,
    linkedInUrl: null
  };

  if (employer) {
    newEmployer.id = employer.id;
    newEmployer.name = employer.name;
    newEmployer.email = employer.email;
    newEmployer.industry = employer.industry;
    newEmployer.chamberOfCommerceIdentifier = employer.chamberOfCommerceIdentifier;
    newEmployer.linkedInUrl = employer.linkedInUrl;
    var result = _.merge({}, newEmployer, employer);
    return result;
  }

  return newEmployer;
};

// ==============================|| EMPLOYER ADD / EDIT / DELETE ||============================== //

const UpsertEmployer = ({ employer, onCancel }) => {
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const theme = useTheme();
  const dispatch = useDispatch();
  const isCreating = !employer;

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(employer?.logoImageUrl ? employer.logoImageUrl : avatarImage('./default.png'));

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const EmployerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required').nullable(true),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email').nullable(true),
    industry: Yup.string().required('Industry is required').nullable(true),
    chamberOfCommerceIdentifier: Yup.string().max(50).nullable(true),
    linkedInUrl: Yup.string().max(255).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(employer),
    validationSchema: EmployerSchema,
    onSubmit: (values, { setSubmitting }) => {
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
            onCancel();
            return;
          }

          dispatch(
            openSnackbar({
              open: true,
              message: 'Employer updated.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        } else {

          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers',
            {
              method: 'POST',
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
                message: 'Adding an employer failed.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
            setSubmitting(false);
            onCancel();
            return;
          }

          dispatch(
            openSnackbar({
              open: true,
              message: 'Employer created.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        }

        setSubmitting(false);
        onCancel();
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
            <DialogTitle>{employer ? 'Update Employer' : 'Add Employer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-name">Name</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-name"
                          placeholder="Enter Employer Name"
                          value={normalizeInputValue(values.name)}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-email"
                          placeholder="Enter Employer Email"
                          value={normalizeInputValue(values.email)}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
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
                              placeholder="Choose an industry"
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
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-coc-identifier">Chamber of Commerce Identifier</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-coc-identifier"
                          placeholder="Enter Chamber of Commerce Identifier"
                          value={normalizeInputValue(values.chamberOfCommerceIdentifier)}
                          name="chamberOfCommerceIdentifier"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.chamberOfCommerceIdentifier && errors.chamberOfCommerceIdentifier)}
                          helperText={touched.chamberOfCommerceIdentifier && errors.chamberOfCommerceIdentifier}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="employer-linkedin-url">LinkedIn Url</InputLabel>
                        <TextField
                          fullWidth
                          id="employer-linkedin-url"
                          placeholder="Enter LinkedIn Url"
                          value={normalizeInputValue(values.linkedInUrl)}
                          name="linkedInUrl"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.linkedInUrl && errors.linkedInUrl)}
                          helperText={touched.linkedInUrl && errors.linkedInUrl}
                        />
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
                    <Tooltip title="Delete Employer" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {employer ? 'Update' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertEmployerDelete title={employer.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

UpsertEmployer.propTypes = {
  employer: PropTypes.any,
  onCancel: PropTypes.func
};

export default UpsertEmployer;
