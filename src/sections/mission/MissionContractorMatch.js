import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  ButtonBase,
  Tab,
  Tabs,
  Box,
  IconButton
} from '@mui/material';
import { LinkedinOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, RightOutlined, RiseOutlined, QuestionOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { getEllipsis } from 'utils/stringUtils';
import countries from 'data/countries';
import { PopupTransition } from 'components/@extended/Transitions';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| MISSION CONTRACTOR MATCH ||============================== //

const MissionContractorMatch = ({ missionId, contractorId }) => {
  const peraResponseResultTabGroup = 'peraResponseResultTabGroup';
  const peraQuestionsAndAnswersTabGroup = 'peraQuestionsAndAnswersTabGroup';
  const { keycloak } = useKeycloak();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});
  const [selectedTraitResult, setSelectedTraitResult] = useState(null);

  const theme = useTheme();
  const [tabGroup, setTabGroup] = useState(peraResponseResultTabGroup);
  const [selectedPeraResponseResultIndex, setSelectedPeraResponseResultIndex] = useState(0);
  const [traitDetailsTabsValue, setTraitDetailsTabsValue] = useState(0);

  const handleChangeTraitDetailsTabs = (event, newValue) => {
    setTraitDetailsTabsValue(newValue);
  };

  const handleTabClick = (group, index) => {
    setTabGroup(group);
    setSelectedPeraResponseResultIndex(index ?? null);
  };

  const bindMissionContractorMatch = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/matches/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      if (json?.missionContractorMatch?.contractor?.mainImageUrl)
        json.missionContractorMatch.contractor.mainImageSrc = await getImageSrc(json.missionContractorMatch.contractor.mainImageUrl);

      setMissionContractorMatch(json.missionContractorMatch);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenTraitDetails = async (traitResult) => {
    setSelectedTraitResult(traitResult);
  }

  const handleCloseTraitDetails = async () => {
    setSelectedTraitResult(null);
  }

  useEffect(() => {
    (async () => {
      await bindMissionContractorMatch();
    })();
  }, []);

  const getImageSrc = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return avatarImage(`./default.png`);
      }

      let response = await fetch(imageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  let selectedPeraAssessment = null;
  if (tabGroup === peraResponseResultTabGroup)
    selectedPeraAssessment = missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree[selectedPeraResponseResultIndex];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt={missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName}
                      sx={{ width: 124, height: 124, border: '1px dashed' }}
                      src={missionContractorMatch?.contractor?.mainImageSrc} />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">86</Typography>
                      <Typography color="secondary">Post</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">40</Typography>
                      <Typography color="secondary">Project</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">4.5K</Typography>
                      <Typography color="secondary">Members</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    {missionContractorMatch?.contractor?.email && 
                      <ListItem>
                        <ListItemIcon>
                          <MailOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{missionContractorMatch?.contractor?.email}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    }
                    {missionContractorMatch?.contractor?.phoneNumber && 
                      <ListItem>
                        <ListItemIcon>
                          <PhoneOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{missionContractorMatch?.contractor?.phoneNumber}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>  
                    }
                    {missionContractorMatch?.contractor?.country &&
                      <ListItem>
                        <ListItemIcon>
                          <EnvironmentOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Typography align="right">{countries.find(x => x.code === missionContractorMatch?.contractor?.country)?.label}</Typography>
                        </ListItemSecondaryAction>
                      </ListItem>   
                    }
                    {missionContractorMatch?.contractor?.linkedInUrl && 
                      <ListItem>
                        <ListItemIcon>
                          <LinkedinOutlined />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={missionContractorMatch?.contractor?.linkedInUrl} target="_blank">
                            {getEllipsis(missionContractorMatch?.contractor?.linkedInUrl, 40)}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>  
                    }
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
                    {missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree?.map((item, index) => {
                      return (
                        <ListItemButton key={index} selected={selectedPeraResponseResultIndex === index} onClick={() => handleTabClick(peraResponseResultTabGroup, index)}>
                          <ListItemText primary={item?.linkedAssessment?.assessment?.name} />
                          <ListItemIcon>
                            <RightOutlined />
                          </ListItemIcon>
                        </ListItemButton>
                      );
                    })}
                    {missionContractorMatch?.contractorPeraSurveyResponse &&
                      <ListItemButton selected={tabGroup === peraQuestionsAndAnswersTabGroup} onClick={() => handleTabClick(peraQuestionsAndAnswersTabGroup)}>
                        <ListItemText primary="Questions & Answers" />
                        <ListItemIcon>
                          <RightOutlined />
                        </ListItemIcon>
                      </ListItemButton>
                    }
                  </List>
                </Grid>

              </Grid>
            </MainCard>
          </Grid>

        </Grid>

      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {tabGroup === peraResponseResultTabGroup && selectedPeraAssessment &&
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h3">{selectedPeraAssessment?.linkedAssessment?.assessment?.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4">{selectedPeraAssessment?.linkedAssessment?.assessment?.hrPage?.subtitle?.replace('{candidateName}', missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LinearWithLabel value={selectedPeraAssessment?.percentile * 100} />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Chip label="STRENGTH" size="small" color="success" className="small-chip" />
                          </Grid>
                          {selectedPeraAssessment?.traitResults?.filter(x => x.isStrength)?.map((traitResult, traitResultIndex) => {
                            return (
                              <Grid key={traitResultIndex} item xs={12}>
                                <ButtonBase component={Link} onClick={() => { handleOpenTraitDetails(traitResult); }} underline="none">
                                  <Typography variant="h5" sx={{ mr: 1.25 }} >{traitResult?.trait?.hrPage?.title}</Typography>
                                  <RightOutlined />
                                </ButtonBase>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Chip label="GROWTH OPPORTUNITY" size="small" color="error" className="small-chip" />
                          </Grid>
                          {selectedPeraAssessment?.traitResults?.filter(x => x.isGrowthOpportunity)?.map((traitResult, traitResultIndex) => {
                            return (
                              <Grid key={traitResultIndex} item xs={12}>
                                <ButtonBase component={Link} onClick={() => { handleOpenTraitDetails(traitResult); }} underline="none">
                                  <Typography variant="h5" sx={{ mr: 1.25 }} >{traitResult?.trait?.hrPage?.title}</Typography>
                                  <RightOutlined />
                                </ButtonBase>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4">Results</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{selectedPeraAssessment?.linkedAssessment?.assessment?.hrPage?.body}</Typography>
                  </Grid>

                  <Grid item xs={12} sx={{mt: 2}}>
                    <Grid container spacing={4}>
                      {selectedPeraAssessment?.traitResults?.map((item, index) => {
                        return (
                          <Grid key={index} item xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} lg={4} md={5}>
                                <ButtonBase component={Link} onClick={() => { handleOpenTraitDetails(item); }} underline="none">
                                  <Typography variant="h5" sx={{mr: 1.25}} >{item?.trait?.hrPage?.title}</Typography>
                                  <RightOutlined />
                                  {item?.isStrength && <Chip label="STRENGTH" size="small" color="success" className="small-chip button-h5-chip" />}
                                  {item?.isGrowthOpportunity && <Chip label="GROWTH OPPORTUNITY" size="small" color="error" className="small-chip button-h5-chip" />}
                                </ButtonBase>
                              </Grid>
                              <Grid item xs={12} lg={8} md={7}>
                                <LinearWithLabel value={item?.percentile * 100} />
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  
                </Grid>
              </MainCard>
            }
            {tabGroup === peraQuestionsAndAnswersTabGroup &&
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h3">Questions & Answers</Typography>
                  </Grid>
                  {missionContractorMatch?.contractorPeraSurveyResponse?.surveyAnswers.map((surveyAnswer, surveyAnswerIndex) => {
                    return (
                      <Grid key={surveyAnswerIndex} item xs={12}>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12}>
                            <Typography variant="h4">{surveyAnswer?.survey?.name}</Typography>
                          </Grid>
                          {surveyAnswer?.answers?.map((answer, answerIndex) => {
                            return (
                              <Grid key={answerIndex} item xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item>
                                    <Avatar>
                                      <FileTextOutlined />
                                    </Avatar>
                                  </Grid>
                                  <Grid item xs zeroMinWidth>
                                    <Typography align="left" variant="h5">
                                      {answer?.question?.page?.title}
                                    </Typography>
                                    <Typography align="left" variant="body1" color="secondary">
                                      {answer?.body}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </MainCard>
            }
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleCloseTraitDetails}
        open={selectedTraitResult ? true : false}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedTraitResult?.trait?.hrPage?.title}
          <IconButton sx={{ ml: 'auto' }} onClick={handleCloseTraitDetails}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Typography paragraph={true} >{selectedTraitResult?.trait?.hrPage?.body}</Typography>
          {selectedTraitResult?.trait?.relatedTraits?.length > 0 &&
            <Typography variant="caption" paragraph={true}>
              Other associated competencies:
              {selectedTraitResult?.trait?.relatedTraits?.map((item, index) => { return (<span key={index}>{' ' + item?.hrPage?.title + (index < selectedTraitResult?.trait?.relatedTraits?.length - 1 ? ',' : '')}</span>); })}
            </Typography>
          }
          {selectedTraitResult?.trait?.tips?.length > 0 && selectedTraitResult?.trait?.hrQuestions?.length > 0 &&
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                <Tabs value={traitDetailsTabsValue} onChange={handleChangeTraitDetailsTabs} variant="scrollable" scrollButtons="auto" aria-label="trait details tabs">
                  {selectedTraitResult?.trait?.tips?.length > 0 &&
                    <Tab value={0} label="Growth tip" icon={<RiseOutlined />} iconPosition="start" />
                  }
                  {selectedTraitResult?.trait?.hrQuestions?.length > 0 &&
                    <Tab value={1} label="Follow-up questions" icon={<QuestionOutlined />} iconPosition="start" />
                  }
                </Tabs>
              </Box>
              {traitDetailsTabsValue === 0 &&
                <Box sx={{ mt: 2.5 }}>
                  {selectedTraitResult?.trait?.tips?.map((tip, tipIndex) => {
                    return (
                      <div key={tipIndex}>
                        <Typography variant="h5">{tip?.title}</Typography>
                        <Typography paragraph={true}>{tip?.body}</Typography>
                      </div>
                    );
                  })}
                </Box>
              }
              {traitDetailsTabsValue === 1 &&
                <Box sx={{ mt: 2.5 }}>
                  <Typography variant="h5">Use these questions to look for answers related to</Typography>
                  <ul>
                    {selectedTraitResult?.trait?.hrQuestionTopics?.map((questionTopic, questionTopicIndex) => {
                      return (
                        <li key={questionTopicIndex}>
                          {questionTopic}
                        </li>
                      );
                    })}
                  </ul>
                  <Typography variant="h5">Questions</Typography>
                  <ol>
                    {selectedTraitResult?.trait?.hrQuestions?.map((question, questionIndex) => {
                      return (
                        <li key={questionIndex}>
                          {question?.page?.title}
                        </li>
                      );
                    })}
                  </ol>
                </Box>
              }
            </>
          }
        </DialogContent>
      </Dialog>

    </Grid>
  );
};

export default MissionContractorMatch;
