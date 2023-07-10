import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  FormHelperText,
  Box,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
  Button
} from '@mui/material';
import MainCard from 'components/MainCard';
import SanitizedHTML from 'react-sanitized-html';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

const getInitialValues = (contractorDetails) => {
  const newContractorDetails = {
    missionNotes: null
  };

  if (contractorDetails) {
    var result = _.merge({}, newContractorDetails, contractorDetails);
    return result;
  }

  return newContractorDetails;
};

const MissionPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { keycloak } = useKeycloak();
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [missionContractor, setMissionContractor] = useState(null);
  const personalInformation = useSelector(state => state.personalInformation);

  const bindData = async () => {
    try {
      let missionResponse = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let missionJson = await missionResponse.json();

      setMission(missionJson);

      let missionContractorResponse = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let missionContractorJson = await missionContractorResponse.json();

      setMissionContractor(missionContractorJson);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);
  const ContractorDetailsSchema = Yup.object().shape({
    missionNotes: Yup.string().max(1000).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(missionContractor?.contractorDetails),
    validationSchema: ContractorDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id) + '/contractor-details',
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
        let json = await response.json();

        var newMissionContractor = { ...missionContractor };
        newMissionContractor.contractorDetails = json;

        setMissionContractor(newMissionContractor);

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <Box sx={{ mt: 2.5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Mission">
            <List sx={{ py: 0 }}>
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Title</Typography>
                      <Typography>{mission?.title}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Employer</Typography>
                      <Typography>{mission?.employerName}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Description</Typography>
                      <SanitizedHTML html={mission?.description} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">About the Company</Typography>
                      <SanitizedHTML html={mission?.aboutTheCompany} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Current Setup</Typography>
                      <SanitizedHTML html={mission?.currentSetup} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Why We Need You</Typography>
                      <SanitizedHTML html={mission?.whyWeNeedYou} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Outcome</Typography>
                      <SanitizedHTML html={mission?.outcome} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Profile We Are Looking For</Typography>
                      <SanitizedHTML html={mission?.profileType} />
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard title="Notes">
            <List sx={{ py: 0 }}>
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Admin Notes About Me</Typography>
                      <SanitizedHTML html={
                        missionContractor?.adminDetails?.showContractorNotesToContractor &&
                        missionContractor?.adminDetails?.contractorNotes ?
                        missionContractor?.adminDetails?.contractorNotes : '<i>No data available.</i>'
                      } />
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Admin Notes About the Mission</Typography>
                      <SanitizedHTML html={
                        missionContractor?.adminDetails?.showMissionNotesToContractor &&
                          missionContractor?.adminDetails?.missionNotes ?
                          missionContractor?.adminDetails?.missionNotes : '<i>No data available.</i>'
                      } />
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
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
                    }}>

                    <FormikProvider value={formik}>
                      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">My Notes About the Mission</Typography>
                          <ReactQuill
                            id="contractor-mission-notes"
                            value={normalizeInputValue(values.missionNotes)}
                            onChange={(e) => setFieldValue('missionNotes', e)}
                          />
                          {touched.missionNotes && errors.missionNotes && (
                            <FormHelperText error id="contractor-mission-notes-helper">
                              {errors.missionNotes}
                            </FormHelperText>
                          )}
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                          <Button type="submit" variant="contained" disabled={isSubmitting}>
                            Save
                          </Button>
                        </Stack>
                      </Form>
                    </FormikProvider>
                  </Grid>
                </Grid>
              </ListItem>

            </List>
          </MainCard>
        </Grid>

      </Grid>
    </Box>
  );
};

export default MissionPage;
