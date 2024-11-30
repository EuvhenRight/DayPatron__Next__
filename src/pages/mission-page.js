import { useState, useEffect } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Switch,
  InputLabel,
  createFilterOptions,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { EnvironmentOutlined, GlobalOutlined, LaptopOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import SanitizedHTML from 'react-sanitized-html';
import InfoWrapper from 'components/InfoWrapper';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Rte from 'components/Rte';
import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';
import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';
import { TimeStartAndEndTimestamp } from 'utils/timeStamp';

const avatarImage = require.context('assets/images/missions', true);

const MissionPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [missionContractor, setMissionContractor] = useState(null);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);
  const personalInformation = useSelector((state) => state.personalInformation);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const filter = createFilterOptions();

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(mission?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);
    })();
  }, [mission?.mainImageUrl, keycloak?.idToken]);

  // useEffect(() => {
  //   (async () => {
  //     var imgSrc = await getImageSrc(mission?.employerMainImageUrl);
  //     setEmployerAvatar(imgSrc);

  //     if (imgSrc)
  //       setTimeout(function () {
  //         URL.revokeObjectURL(imgSrc);
  //       }, 1000);
  //   })();
  // }, [mission?.employerMainImageUrl, keycloak?.idToken]);

  const getImageSrc = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return avatarImage(`./default.png`);
      }

      let response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });

      let imageBlob = await response.blob();

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  const bindData = async () => {
    try {
      let missionResponse = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId), {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });

      let missionJson = await missionResponse.json();

      setMission(missionJson);

      let missionContractorResponse = await fetch(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL +
          '/missions/' +
          encodeURIComponent(missionId) +
          '/contractors/' +
          encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + keycloak.idToken
          }
        }
      );

      let missionContractorJson = await missionContractorResponse.json();

      setMissionContractor(missionContractorJson);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyButtonClick = async () => {
    try {
      setIsCreatingApplication(true);

      let response = await fetch(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL +
          '/missions/' +
          encodeURIComponent(missionId) +
          '/contractors/' +
          encodeURIComponent(personalInformation.id) +
          '/applications',
        { method: 'POST', headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: (await response.text()) ?? 'Failed applying for mission.',
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
  };

  const handleUnapplyButtonClick = async () => {
    try {
      setIsDeletingApplication(true);

      let response = await fetch(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL +
          '/missions/' +
          encodeURIComponent(missionId) +
          '/contractors/' +
          encodeURIComponent(personalInformation.id) +
          '/applications',
        { method: 'DELETE', headers: { Authorization: 'Bearer ' + keycloak.idToken } }
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
  };

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, [personalInformation?.id, keycloak?.idToken, missionId]);

  const ContractorNotesSchema = Yup.object().shape({
    missionNotes: Yup.string().max(5000).nullable(true),
    showContractorNotesToEmployer: Yup.boolean().nullable(true)
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

        let response = await fetch(
          process.env.REACT_APP_JOBMARKET_API_BASE_URL +
            '/missions/' +
            encodeURIComponent(missionId) +
            '/contractors/' +
            encodeURIComponent(personalInformation.id) +
            '/contractor-notes',
          {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + keycloak.idToken,
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

        let response = await fetch(
          process.env.REACT_APP_JOBMARKET_API_BASE_URL +
            '/missions/' +
            encodeURIComponent(missionId) +
            '/contractors/' +
            encodeURIComponent(personalInformation.id) +
            '/tags',
          {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + keycloak.idToken,
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
      if (!selectedOption) return;

      if (!result.includes(selectedOption)) result.push(selectedOption);
    });

    return result;
  };

  console.log(mission, 'mission');

  return (
    <Box sx={{ mt: 2.5 }}>
      <Grid container spacing={2} sx={{ position: 'relative' }}>
        {/* Header Info*/}
        <Grid item xs={12} md={8} sx={{ mt: 2.5, mb: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={matchDownSm ? 12 : null}>
              <Stack direction="row" justifyContent="center">
                <Avatar alt={mission?.title} src={avatar} size={matchDownSm ? 'xxxxl' : 'xxxl'} />
              </Stack>
            </Grid>
            {/* Title*/}
            <Grid item xs={matchDownSm ? 12 : null}>
              <Stack direction="column" alignItems={matchDownSm ? 'center' : 'flex-start'}>
                <Typography variant="h3">{mission?.title}</Typography>
                <Stack direction="row" alignItems={matchDownSm ? 'center' : 'flex-start'} spacing={2.5} mt={2}>
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                    <GlobalOutlined style={{ fontSize: '16px' }} />
                    <Typography variant="h6">{mission?.employerName}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <EnvironmentOutlined style={{ fontSize: '16px' }} />
                    <Typography variant="h6">{mission?.employerCity}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LaptopOutlined style={{ fontSize: '16px' }} />
                    <Typography variant="h6">Hybrid</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Grid item xs={matchDownSm ? 12 : null}>
                <Stack
                  direction="row"
                  justifyContent={matchDownSm ? 'center' : 'flex-start'}
                  alignItems="center"
                  spacing={2}
                  sx={{ mt: 1.5 }}
                >
                  <Button
                    variant="outlined"
                    sx={{ width: '100px', height: '27px', marginBottom: 0.5 }}
                    onClick={() => {
                      navigate('/messaging', { state: { targetEmployerId: mission?.employerId } });
                    }}
                  >
                    Message
                  </Button>
                  {!missionContractor?.application && !mission?.closedOnUtc && (
                    <Button
                      sx={{ width: '100px', height: '27px', marginBottom: 0.5 }}
                      variant="contained"
                      onClick={handleApplyButtonClick}
                      disabled={isCreatingApplication}
                    >
                      Apply
                    </Button>
                  )}
                  {missionContractor?.application && !mission?.closedOnUtc && (
                    <Button
                      sx={{ width: '100px', height: '27px', marginBottom: 0.5 }}
                      variant="outlined"
                      onClick={handleUnapplyButtonClick}
                      disabled={isDeletingApplication}
                    >
                      Unapply
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Main Info*/}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} sx={{ position: 'relative' }}>
            <Grid item xs={12} md={8}>
              <MainCard>
                <List sx={{ py: 0 }}>
                  <ListItem>
                    <Grid>
                      <Grid item xs={12}>
                        <Stack spacing={0.5} width={matchDownSm ? '100%' : 'auto'}>
                          <Typography color="primary" variant="h6">
                            Overview
                          </Typography>
                          <SanitizedHTML html={String(mission?.description)} />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={0.5}>
                          <Typography color="primary" variant="h6">
                            Current Setup
                          </Typography>
                          <SanitizedHTML html={String(mission?.currentSetup)} />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={0.5}>
                          <Typography color="primary" variant="h6">
                            Why We Need You
                          </Typography>
                          <SanitizedHTML html={String(mission?.whyWeNeedYou)} />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={0.5}>
                          <Typography color="primary" variant="h6">
                            Outcome
                          </Typography>
                          <SanitizedHTML html={String(mission?.outcome)} />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={0.5}>
                          <Typography color="primary" variant="h6">
                            Profile We Are Looking For
                          </Typography>
                          <SanitizedHTML html={String(mission?.profileType)} />
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
                          {missionContractor?.isMatch && (
                            <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                              <Chip color="primary" size="small" label="Matched" />
                            </ListItem>
                          )}
                          {missionContractor?.invitation && (
                            <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                              <Chip color="primary" size="small" label="Invited" />
                            </ListItem>
                          )}
                          {missionContractor?.application && (
                            <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                              <Chip color="primary" size="small" label="Applied" />
                            </ListItem>
                          )}
                          {missionContractor?.approval && (
                            <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                              <Chip color="success" size="small" label="Approved" />
                            </ListItem>
                          )}
                          {mission?.closedOnUtc && (
                            <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                              <Chip color="error" size="small" label="Closed" />
                            </ListItem>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </MainCard>
            </Grid>
            <Grid container item xs={12} md={4} spacing={2} direction="column" sx={{ height: '100%' }}>
              <Grid item xs={12} md={4}>
                <MainCard>
                  <Stack spacing={0.5} alignItems="center">
                    <Typography color="primary" variant="h6">
                      About the Company
                    </Typography>
                    <SanitizedHTML html={String(mission?.employerDescription)} />
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={4}>
                {/* Right Side */}
                <MainCard>
                  <Stack spacing={0.5} alignItems="left">
                    {/* Role */}
                    <Stack spacing={0.5} alignItems="center" sx={{ '& .MuiStack-root': { mt: 2 } }}>
                      <Typography color="primary" variant="h6">
                        Role
                      </Typography>
                      <Chip
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                        label={mission?.role}
                      />
                    </Stack>
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6">
                        Alternative Roles
                      </Typography>
                      {/* Alternative Roles */}
                      <Stack direction="row" spacing={1}>
                        {mission?.alternativeRoles.map((role, index) => (
                          <Grid key={index} item sx={{ mr: 0.5 }}>
                            <Chip
                              color="secondary"
                              variant="outlined"
                              sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                              label={role}
                            />
                          </Grid>
                        ))}
                      </Stack>
                    </Stack>
                    {/* Industry */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6">
                        Industry
                      </Typography>
                      <Chip
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                        label={mission?.industry}
                      />
                    </Stack>
                    {/* Alternative Industries */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6">
                        Alternative Industries
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {mission?.alternativeIndustries.map((industry, index) => (
                          <Grid key={index} item sx={{ mr: 0.5 }}>
                            <Chip
                              color="secondary"
                              variant="outlined"
                              sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                              label={industry}
                            />
                          </Grid>
                        ))}
                      </Stack>
                    </Stack>
                    {/* Years Experience */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6" textAlign={'center'}>
                        Years Experience
                      </Typography>
                      <Chip
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                        label={mission?.yearsExperience}
                      />
                    </Stack>
                    {/* Number of hour per week(indicative) */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6" textAlign={'center'}>
                        Number of hour per week(indicative)
                      </Typography>
                      <Chip
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                        label={mission?.effortHours}
                      />
                    </Stack>
                    {/* Workplace Type */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6" textAlign={'center'}>
                        Workplace Type
                      </Typography>
                      <Chip
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                        label={'Hybrid||Remote|Onsite'}
                      />
                    </Stack>
                    {/* Languages */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="primary" variant="h6" textAlign={'center'}>
                        Languages
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {/* Languages */}
                        {mission?.requiredLanguages.map((language, index) => (
                          <Grid key={index} item sx={{ mr: 0.5 }}>
                            <Chip
                              color="secondary"
                              variant="outlined"
                              sx={{ mb: '3px', fontSize: '12px', height: '22px', '& .MuiChip-label': { pl: '5px', pr: '5px' } }}
                              label={language}
                            />
                          </Grid>
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={0.5} sx={{ justifyContent: 'center', mt: 2 }}>
                    <Stack spacing={0.5} alignItems="center" textAlign={'flex-start'}>
                      <Typography color="primary" variant="h6" textAlign={'center'}>
                        Start and End Date(indicative)
                      </Typography>
                      <Typography>
                        start date: <TimeStartAndEndTimestamp timestamp={String(mission?.startDate)} />
                      </Typography>
                      <Typography>
                        end date: <TimeStartAndEndTimestamp timestamp={String(mission?.endDate)} />
                      </Typography>
                    </Stack>
                  </Stack>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12} md={8}>
          <MainCard
            title={
              <InfoWrapper tooltipText="mission_notes_tooltip">
                <span>Notes</span>
              </InfoWrapper>
            }
          >
            <List sx={{ py: 0 }}>
              {missionContractor?.employerNotes?.showEmployerNotesToContractor && (
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={0.5}>
                        <InfoWrapper tooltipText="employer_notes_about_me_tooltip">
                          <Typography color="secondary">Company Notes About Me</Typography>
                        </InfoWrapper>
                        <SanitizedHTML html={String(missionContractor?.employerNotes?.contractorNotes)} />
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              )}

              {missionContractor?.adminNotes?.showContractorNotesToContractor && (
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={0.5}>
                        <InfoWrapper tooltipText="mission_admin_notes_about_me_tooltip">
                          <Typography color="secondary">Community Manager About Me</Typography>
                        </InfoWrapper>
                        <SanitizedHTML html={String(missionContractor?.adminNotes?.contractorNotes)} />
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              )}

              {missionContractor?.adminNotes?.showMissionNotesToContractor && (
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={0.5}>
                        <InfoWrapper tooltipText="mission_admin_notes_about_the_mission_tooltip">
                          <Typography color="secondary">Community Manager About the Mission</Typography>
                        </InfoWrapper>
                        <SanitizedHTML html={String(missionContractor?.adminNotes?.missionNotes)} />
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              )}

              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormikProvider value={formik}>
                      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={0.5}>
                          <InfoWrapper tooltipText="mission_my_notes_about_the_mission_tooltip">
                            <Typography color="secondary">My Notes About the Mission</Typography>
                          </InfoWrapper>
                          <Rte
                            id="contractor-mission-notes"
                            value={normalizeInputValue(values?.missionNotes)}
                            onChange={(e) => setFieldValue('missionNotes', e)}
                          />
                          {touched.missionNotes && errors.missionNotes && (
                            <FormHelperText error id="contractor-mission-notes-helper">
                              {errors.missionNotes}
                            </FormHelperText>
                          )}
                          <InputLabel>Show My Notes to the Company</InputLabel>
                          <Switch
                            id="show-contractor-notes-to-employer"
                            edge="end"
                            checked={normalizeBooleanInputValue(values?.showContractorNotesToEmployer)}
                            onChange={(event, checked) => {
                              setFieldValue('showContractorNotesToEmployer', checked);
                            }}
                            inputProps={{ 'aria-labelledby': 'switch-list-label-sb' }}
                          />
                          {touched.showContractorNotesToEmployer && errors.showContractorNotesToEmployer && (
                            <FormHelperText error id="show-contractor-notes-to-employer-helper">
                              {errors.showContractorNotesToEmployer}
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

        <Grid item xs={12} md={4}>
          <MainCard
            title={
              <InfoWrapper tooltipText="mission_tags_tooltip">
                <span>Tags</span>
              </InfoWrapper>
            }
          >
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

                              if (params.inputValue !== '') {
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
