import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import {
  FormHelperText,
  Button,
  Grid,
  InputLabel,
  Stack,
  Switch,
  Typography
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Rte from 'components/Rte';

import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';

// ==============================|| MISSION CONTRACTOR MATCH ADMIN NOTES||============================== //

const getInitialValues = (adminNotes) => {
  const newAdminNotes = {
    contractorNotes: null,
    showContractorNotesToEmployer: null,
    showContractorNotesToContractor: null,
    missionNotes: null,
    showMissionNotesToContractor: null,
    showMissionNotesToEmployer: null
  };

  if (adminNotes) {
    var result = _.merge({}, newAdminNotes, adminNotes);
    return result;
  }

  return newAdminNotes;
};

const MissionContractorMatchAdminNotes = ({ missionId, contractorId, adminNotes, setAdminNotes }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();

  const AdminNotesSchema = Yup.object().shape({
    contractorNotes: Yup.string().max(5000).nullable(true),
    showContractorNotesToEmployer: Yup.boolean().nullable(true),
    showContractorNotesToContractor: Yup.boolean().nullable(true),
    missionNotes: Yup.string().max(5000).nullable(true),
    showMissionNotesToContractor: Yup.boolean().nullable(true),
    showMissionNotesToEmployer: Yup.boolean().nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(adminNotes),
    validationSchema: AdminNotesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/admin-notes',
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
            message: 'Saved.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );

        setSubmitting(false);
        let json = await response.json();
        setAdminNotes(json);

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (

    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Admin Notes</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="match-admin-contractor-notes">Notes About the Talent</InputLabel>
              <Rte
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
            <Stack spacing={1.25}>
              <InputLabel>Show Talent Notes to Company</InputLabel>
              <Stack direction="row" alignItems="center">
                <Switch
                  id="show-contractor-notes-to-employer"
                  edge="end"
                  checked={normalizeBooleanInputValue(values?.showContractorNotesToEmployer)}
                  onChange={(event, checked) => {
                    setFieldValue("showContractorNotesToEmployer", checked);
                  }}
                  inputProps={{ 'aria-labelledby': 'switch-list-label-sb' }}
                />
                {touched.showContractorNotesToEmployer && errors.showContractorNotesToEmployer && (
                  <FormHelperText error id="show-contractor-notes-to-employer-helper">
                    {errors.showContractorNotesToEmployer}
                  </FormHelperText>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1.25}>
              <InputLabel>Show Talent Notes to Talent</InputLabel>
              <Stack direction="row" alignItems="center">
                <Switch
                  id="show-contractor-notes-to-contractor"
                  edge="end"
                  checked={normalizeBooleanInputValue(values?.showContractorNotesToContractor)}
                  onChange={(event, checked) => {
                    setFieldValue("showContractorNotesToContractor", checked);
                  }}
                  inputProps={{ 'aria-labelledby': 'switch-list-label-sb' }}
                />
                {touched.showContractorNotesToContractor && errors.showContractorNotesToContractor && (
                  <FormHelperText error id="show-contractor-notes-to-contractor-helper">
                    {errors.showContractorNotesToContractor}
                  </FormHelperText>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="match-admin-mission-notes">Notes About the Mission</InputLabel>
              <Rte
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
            <Stack spacing={1.25}>
              <InputLabel>Show Mission Notes to Employer</InputLabel>
              <Stack direction="row" alignItems="center">
                <Switch
                  id="show-mission-notes-to-employer"
                  edge="end"
                  checked={normalizeBooleanInputValue(values?.showMissionNotesToEmployer)}
                  onChange={(event, checked) => {
                    setFieldValue("showMissionNotesToEmployer", checked);
                  }}
                  inputProps={{ 'aria-labelledby': 'switch-list-label-sb' }}
                />
                {touched.showMissionNotesToEmployer && errors.showMissionNotesToEmployer && (
                  <FormHelperText error id="show-mission-notes-to-employer-helper">
                    {errors.showMissionNotesToEmployer}
                  </FormHelperText>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1.25}>
              <InputLabel>Show Mission Notes to Talent</InputLabel>
              <Stack direction="row" alignItems="center">
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
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
            </Stack>
          </Grid>

        </Grid>

      </Form>
    </FormikProvider>
  );
};

export default MissionContractorMatchAdminNotes;
