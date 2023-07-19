import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  TextField,
  FormHelperText,
  Box,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
  Button,
  Chip,
  createFilterOptions
} from '@mui/material';
import MainCard from 'components/MainCard';
import SanitizedHTML from 'react-sanitized-html';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';

const MissionPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { keycloak } = useKeycloak();
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [missionContractor, setMissionContractor] = useState(null);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);
  const personalInformation = useSelector(state => state.personalInformation);

  const filter = createFilterOptions();

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

  const handleApplyButtonClick = async () => {
    try {
      setIsCreatingApplication(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id) + '/applications',
        { method: 'POST', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed applying for mission.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsCreatingApplication(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully applied for mission.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsCreatingApplication(false);

      let json = await response.json();
      var newMissionContractor = { ...missionContractor };
      newMissionContractor.application = json;

      setMissionContractor(newMissionContractor);
    } catch (error) {
      setIsCreatingApplication(false);
      console.log(error);
    }
  }

  const handleUnapplyButtonClick = async () => {
    try {
      setIsDeletingApplication(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id) + '/applications',
        { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed unapplying from mission.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsDeletingApplication(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully unapplied from mission.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsDeletingApplication(false);

      var newMissionContractor = { ...missionContractor };
      newMissionContractor.application = null;

      setMissionContractor(newMissionContractor);
    } catch (error) {
      setIsDeletingApplication(false);
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  const ContractorNotesSchema = Yup.object().shape({
    missionNotes: Yup.string().max(1000).nullable(true)
  });

  const ContractorTagsSchema = Yup.object().shape({
    tags: Yup.array().of(Yup.string()).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: missionContractor?.contractorNotes,
    validationSchema: ContractorNotesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id) + '/contractor-notes',
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
        newMissionContractor.contractorNotes = json;

        setMissionContractor(newMissionContractor);

      } catch (error) {
        setSubmitting(false);
        console.error(error);
      }
    }
  });

  const formikTags = useFormik({
    enableReinitialize: true,
    initialValues: { tags: missionContractor?.tags },
    validationSchema: ContractorTagsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(personalInformation.id) + '/tags',
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
        newMissionContractor.tags = json.tags;
        setMissionContractor(newMissionContractor);

        var newPersonalInformation = { ...personalInformation };
        newPersonalInformation.tags = json.contractorTags;
        dispatch({ type: PERSONAL_INFORMATION_UPDATE, payload: newPersonalInformation });

      } catch (error) {
        setSubmitting(false);
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  const getTagOptions = (userOptions, selectedOptions) => {
    var result = userOptions ? [...userOptions] : [];

    selectedOptions?.map((selectedOption) => {
      if (!selectedOption)
        return;

      if (!result.includes(selectedOption))
        result.push(selectedOption);
    });

    return result;
  }

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

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0,
                        m: 0
                      }}
                      component="ul"
                    >
                      {missionContractor?.isMatch &&
                        <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                          <Chip color="primary" size="small" label="Matched" />
                        </ListItem>
                      }
                      {missionContractor?.invitation &&
                        <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                          <Chip color="primary" size="small" label="Invited" />
                        </ListItem>
                      }
                      {missionContractor?.application &&
                        <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                          <Chip color="primary" size="small" label="Applied" />
                        </ListItem>
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                      {!missionContractor?.application &&
                        <Button variant="contained" onClick={handleApplyButtonClick} disabled={isCreatingApplication}>
                          Apply
                        </Button>  
                      }
                      {missionContractor?.application &&
                        <Button variant="outlined" onClick={handleUnapplyButtonClick} disabled={isDeletingApplication}>
                          Unapply
                        </Button>
                      }
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </MainCard>
        </Grid>

        <Grid item sm={12} md={8}>
          <MainCard title="Notes">
            <List sx={{ py: 0 }}>
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Admin Notes About Me</Typography>
                      <SanitizedHTML html={
                        missionContractor?.adminNotes?.showContractorNotesToContractor &&
                        missionContractor?.adminNotes?.contractorNotes ?
                        missionContractor?.adminNotes?.contractorNotes : '<i>No data available.</i>'
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
                        missionContractor?.adminNotes?.showMissionNotesToContractor &&
                          missionContractor?.adminNotes?.missionNotes ?
                          missionContractor?.adminNotes?.missionNotes : '<i>No data available.</i>'
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
                            value={normalizeInputValue(values?.missionNotes)}
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

        <Grid item sm={12} md={4}>
          <MainCard title="Tags">
            <List sx={{ py: 0 }}>

              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12}>

                    <FormikProvider value={formikTags}>
                      <Form autoComplete="off" noValidate onSubmit={formikTags.handleSubmit}>
                        <Stack spacing={0.5}>
                          <Autocomplete
                            multiple
                            fullWidth
                            options={getTagOptions(personalInformation?.tags, formikTags.values?.tags)}
                            value={formikTags.values?.tags ?? []}
                            onBlur={formikTags.handleBlur}
                            onChange={(event, newValue) => {
                              formikTags.setFieldValue('tags', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select tags"
                                name="tags"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password'
                                }}
                              />
                            )}
                            filterOptions={(options, params) => {
                              const filtered = filter(options, params);

                              if (params.inputValue !== "") {
                                filtered.push(params.inputValue);
                              }
                              return filtered;
                            }}
                          />
                          {formikTags.touched.tags && formikTags.errors.tags && (
                            <FormHelperText error id="contractor-mission-tags-helper">
                              {formikTags.errors.tags}
                            </FormHelperText>
                          )}
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                          <Button type="submit" variant="contained" disabled={formikTags.isSubmitting}>
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
