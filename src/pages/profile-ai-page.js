import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Sectioned from 'components/@extended/progress/Sectioned';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
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
import Avatar from 'components/@extended/Avatar';
import { RightOutlined, RiseOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { PopupTransition } from 'components/@extended/Transitions';
import { useNavigate, useParams } from 'react-router-dom';

// ==============================|| MISSION CONTRACTOR MATCH ||============================== //

const ProfileAiPage = () => {
  const personalInformation = useSelector(state => state.personalInformation);
  const peraResponseResultTabGroup = 'ai-results';
  const peraQuestionsAndAnswersTabGroup = 'ai-qa';

  const { keycloak } = useKeycloak();
  const [selectedTraitResult, setSelectedTraitResult] = useState(null);

  const navigate = useNavigate();
  let { tabGroupId, tabGroupItemIndex } = useParams();
  tabGroupItemIndex = parseInt(tabGroupItemIndex);

  const theme = useTheme();
  const [traitDetailsTabsValue, setTraitDetailsTabsValue] = useState(0);

  const handleChangeTraitDetailsTabs = (event, newValue) => {
    setTraitDetailsTabsValue(newValue);
  };

  const handleTabClick = (group, index) => {
    var indexSuffix = '';
    if (index === 0) {
      indexSuffix = '/0';
    } else if (index) {
      indexSuffix = '/' + index;
    }

    navigate('/missions/' + missionId + '/matches/' + contractorId + '/' + group + indexSuffix);
  };

  const handleOpenTraitDetails = async (traitResult) => {
    setSelectedTraitResult(traitResult);
  }

  const handleCloseTraitDetails = async () => {
    setSelectedTraitResult(null);
  }

  useEffect(() => {
    (async () => {
      await bindMissionContractorMatch();
      await bindMissionContractor();
    })();
  }, [keycloak?.idToken, contractorId, missionId]);

  if (!tabGroupId) {
    if (missionContractorMatch?.contractorPeraSurveyResponse) {
      tabGroupId = peraResponseResultTabGroup;
      tabGroupItemIndex = 0;
    } else {
      tabGroupId = notesTabGroup;
    }
  }

  let selectedPeraAssessment = null;
  if (tabGroupId === peraResponseResultTabGroup)
    selectedPeraAssessment = missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree[tabGroupItemIndex];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {missionContractorMatch?.contractorPeraSurveyResponse &&
                    <List
                      component="nav"
                      sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}
                      subheader={
                        <Typography variant="subtitle1" color="text.primary" sx={{ pl: 2, mb: 1, mt: 2 }}>
                          AI Screening
                        </Typography>
                      }>
                      {missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree?.map((item, index) => {
                        return (
                          <ListItemButton key={index} selected={tabGroupItemIndex === index} onClick={() => handleTabClick(peraResponseResultTabGroup, index)}>
                            <ListItemText primary={item?.linkedAssessment?.assessment?.name} />
                            <ListItemIcon>
                              <RightOutlined />
                            </ListItemIcon>
                          </ListItemButton>
                        );
                      })}
                      {missionContractorMatch?.contractorPeraSurveyResponse &&
                        <ListItemButton selected={tabGroupId === peraQuestionsAndAnswersTabGroup} onClick={() => handleTabClick(peraQuestionsAndAnswersTabGroup)}>
                          <ListItemText primary="Questions & Answers" />
                          <ListItemIcon>
                            <RightOutlined />
                          </ListItemIcon>
                        </ListItemButton>
                      }
                    </List>
                  }

                </Grid>

              </Grid>
            </MainCard>
          </Grid>

        </Grid>

      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {tabGroupId === peraResponseResultTabGroup && selectedPeraAssessment &&
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h3">{selectedPeraAssessment?.linkedAssessment?.assessment?.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4">{selectedPeraAssessment?.linkedAssessment?.assessment?.hrPage?.subtitle?.replace('{candidateName}', missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Sectioned value={selectedPeraAssessment?.percentile * 100} />
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

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Grid container spacing={4}>
                      {selectedPeraAssessment?.traitResults?.map((item, index) => {
                        return (
                          <Grid key={index} item xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} lg={4} md={5}>
                                <ButtonBase component={Link} onClick={() => { handleOpenTraitDetails(item); }} underline="none">
                                  <Typography variant="h5" sx={{ mr: 1.25 }} >{item?.trait?.hrPage?.title}</Typography>
                                  <RightOutlined />
                                  {item?.isStrength && <Chip label="STRENGTH" size="small" color="success" className="small-chip button-h5-chip" />}
                                  {item?.isGrowthOpportunity && <Chip label="GROWTH OPPORTUNITY" size="small" color="error" className="small-chip button-h5-chip" />}
                                </ButtonBase>
                              </Grid>
                              <Grid item xs={12} lg={8} md={7}>
                                <Sectioned value={item?.percentile * 100} />
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
            {tabGroupId === peraQuestionsAndAnswersTabGroup &&
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
            </>
          }
        </DialogContent>
      </Dialog>

    </Grid>
  );
};

export default ProfileAiPage;
