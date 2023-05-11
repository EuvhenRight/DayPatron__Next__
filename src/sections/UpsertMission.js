import PropTypes from 'prop-types';
import {  useState } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Tooltip
} from '@mui/material';
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

// assets
import { DeleteFilled } from '@ant-design/icons';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

// constant
const getInitialValues = (mission) => {
  const newMission = {
    id: null,
    name: null,
    email: null,
    industry: null,
    chamberOfCommerceIdentifier: null,
    linkedInUrl: null
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

const UpsertMission = ({ mission, onCancel, bindMissions }) => {
  const { keycloak } = useKeycloak();
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const dispatch = useDispatch();
  const isCreating = !mission;

  const MissionSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required').nullable(true),
    description: Yup.string().max(255).required('Description is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(mission),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
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
            onCancel();
            return;
          }

          bindMissions();

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
            onCancel();
            return;
          }

          bindMissions();

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
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, values } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{mission ? 'Update Mission' : 'Add Mission'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
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
                    <Button color="error" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {mission ? 'Update' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertMissionDelete mission={mission} open={openAlert} handleClose={handleAlertClose} bindMissions={ bindMissions } />}
    </>
  );
};

UpsertMission.propTypes = {
  mission: PropTypes.any,
  onCancel: PropTypes.func,
  bindMissions: PropTypes.func
};

export default UpsertMission;
