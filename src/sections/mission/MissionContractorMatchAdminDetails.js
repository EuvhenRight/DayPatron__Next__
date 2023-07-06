import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@mui/material/styles';
import {
  FormHelperText,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  List,
  ListItem,
  ListItemText,
  Switch
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';

// ==============================|| MISSION CONTRACTOR MATCH ADMIN DETAILS||============================== //

const getInitialValues = (adminDetails) => {
  const newAdminDetails = {
    contractorNotes: null,
    showContractorNotesToEmployer: null,
    missionNotes: null,
    showMissionNotesToContractor: null
  };

  if (adminDetails) {
    var result = _.merge({}, newAdminDetails, adminDetails);

    return result;
  }

  return newAdminDetails;
};

const MissionContractorMatchAdminDetails = ({ missionId, contractorId }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const [adminDetails, setAdminDetails] = useState(null);

  const bindData = async () => {
    console.log(keycloak.tokenParsed);
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/admin-details',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setAdminDetails(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  const AdminDetailsSchema = Yup.object().shape({
    contractorNotes: Yup.string().max(1000).nullable(true),
    showContractorNotesToEmployer: Yup.boolean().nullable(true),
    missionNotes: Yup.string().max(1000).nullable(true),
    showMissionNotesToContractor: Yup.boolean().nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(adminDetails),
    validationSchema: AdminDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/admin-details',
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

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (

    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>Admin Details</DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>

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
                <InputLabel htmlFor="match-admin-contractor-notes">Notes About the Contractor</InputLabel>
                <ReactQuill
                  id="match-admin-contractor-notes"
                  value={normalizeInputValue(values.contractorNotes)}
                  onChange={(e) => setFieldValue('contractorNotes', e)}
                />
                {touched.contractorNotes && errors.contractorNotes && (
                  <FormHelperText error id="match-admin-contractor-notes-helper">
                    {errors.contractorNotes}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <List sx={{ p: 0 }}>
                <ListItem divider>
                  <ListItemText
                    primary="Show Contractor Notes to Employer"
                  />
                  <Switch
                    id="show-contractor-notes-to-employer"
                    edge="end"
                    checked={normalizeBooleanInputValue(values?.showContractorNotesToEmployer)}
                    onChange={(event, checked) => {
                      setFieldValue("showContractorNotesToEmployer", checked);
                    }}
                    inputProps={{'aria-labelledby': 'switch-list-label-sb'}}
                  />
                  {touched.showContractorNotesToEmployer && errors.showContractorNotesToEmployer && (
                    <FormHelperText error id="show-contractor-notes-to-employer-helper">
                      {errors.showContractorNotesToEmployer}
                    </FormHelperText>
                  )}
                </ListItem>
              </List>
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
                <InputLabel htmlFor="match-admin-mission-notes">Notes About the Mission</InputLabel>
                <ReactQuill
                  id="match-admin-mission-notes"
                  value={normalizeInputValue(values.missionNotes)}
                  onChange={(e) => setFieldValue('missionNotes', e)}
                />
                {touched.missionNotes && errors.missionNotes && (
                  <FormHelperText error id="match-admin-mission-notes-helper">
                    {errors.missionNotes}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <List sx={{ p: 0 }}>
                <ListItem divider>
                  <ListItemText
                    primary="Show Mission Notes to Contractor"
                  />
                  <Switch
                    id="show-mission-notes-to-contractor"
                    edge="end"
                    checked={normalizeBooleanInputValue(values?.showMissionNotesToContractor)}
                    onChange={(event, checked) => {
                      setFieldValue("showMissionNotesToContractor", checked);
                    }}
                    inputProps={{ 'aria-labelledby': 'switch-list-label-sb' }}
                  />
                  {touched.showMissionNotesToContractor && errors.showMissionNotesToContractor && (
                    <FormHelperText error id="show-mission-notes-to-contractor-helper">
                      {errors.showMissionNotesToContractor}
                    </FormHelperText>
                  )}
                </ListItem>
              </List>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default MissionContractorMatchAdminDetails;
