import { useState } from 'react';
import { useOutletContext  } from 'react-router-dom';
import {
    Chip,
    Divider,
    Grid,
    Link,
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

  import { PopupTransition } from 'components/@extended/Transitions';
  import Sectioned from 'components/@extended/progress/Sectioned';
  import { RightOutlined, FileTextOutlined, CloseOutlined, RiseOutlined, QuestionOutlined } from '@ant-design/icons';
  import MainCard from 'components/MainCard';
  import Avatar from 'components/@extended/Avatar';

const AiScreeningResult = () => {
    const [missionContractorMatch] = useOutletContext();
    const [selectedTraitResult, setSelectedTraitResult] = useState(null);
    const [traitDetailsTabsValue, setTraitDetailsTabsValue] = useState(0);

    const handleChangeTraitDetailsTabs = (event, newValue) => {
      setTraitDetailsTabsValue(newValue);
    }
  
    const handleOpenTraitDetails = async (traitResult) => {
      setSelectedTraitResult(traitResult);
    }
  
    const handleCloseTraitDetails = async () => {
      setSelectedTraitResult(null);
    }

    return (
        <>
            <Grid container spacing={3}>
                {missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree?.map((selectedPeraAssessment, selectedPeraAssessmentIndex) => {
                    let strengthTraitResults = selectedPeraAssessment?.traitResults?.filter(x => x.isStrength);
                    let growthOpportunityTraitResults = selectedPeraAssessment?.traitResults?.filter(x => x.isGrowthOpportunity);

                    return (
                        <Grid key={selectedPeraAssessmentIndex} item xs={12}>
                            <MainCard>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4">{selectedPeraAssessment?.linkedAssessment?.assessment?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">{selectedPeraAssessment?.linkedAssessment?.assessment?.hrPage?.subtitle?.replace('{candidateName}', missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName)}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Sectioned value={selectedPeraAssessment?.percentile * 100} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>

                                        {strengthTraitResults?.length > 0 &&
                                            <Grid item xs={12} md={6}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                <Chip label="STRENGTH" size="small" color="success" className="small-chip" />
                                                </Grid>
                                                {strengthTraitResults?.map((traitResult, traitResultIndex) => {
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
                                        }

                                        {growthOpportunityTraitResults?.length > 0 &&
                                            <Grid item xs={12} md={6}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                <Chip label="GROWTH OPPORTUNITY" size="small" color="error" className="small-chip" />
                                                </Grid>
                                                {growthOpportunityTraitResults?.map((traitResult, traitResultIndex) => {
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
                                        }
                                        
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
                        </Grid>
                    );
                })}

                <Grid item xs={12}>
                    <MainCard>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h4">Questions & Answers</Typography>
                            </Grid>
                            {missionContractorMatch?.contractorPeraSurveyResponse?.surveyAnswers ?
                             missionContractorMatch?.contractorPeraSurveyResponse?.surveyAnswers.map((surveyAnswer, surveyAnswerIndex) => {
                                return (
                                    <Grid key={surveyAnswerIndex} item xs={12}>
                                        <Grid container spacing={3} alignItems="center">
                                            <Grid item xs={12}>
                                            <Typography variant="h5">{surveyAnswer?.survey?.name}</Typography>
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
                                                    <Typography align="left" variant="h6">
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
                            }) : <Grid item xs={12}><Typography>No data.</Typography></Grid>}
                        </Grid>
                    </MainCard>
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
                            <Tab value={0} label="Growth Tip" icon={<RiseOutlined />} iconPosition="start" />
                        }
                        {selectedTraitResult?.trait?.hrQuestions?.length > 0 &&
                            <Tab value={1} label="Follow-up Questions" icon={<QuestionOutlined />} iconPosition="start" />
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
        </>
    );
};

export default AiScreeningResult;