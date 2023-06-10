import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { useTheme } from '@mui/material/styles';
import {
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
  Box
} from '@mui/material';
import { LinkedinOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, RightOutlined, RiseOutlined, QuestionOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { getEllipsis } from 'utils/stringUtils';
import countries from 'data/countries';
import { PopupTransition } from 'components/@extended/Transitions';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| MISSION CONTRACTOR MATCH ||============================== //

const MissionContractorMatch = ({ missionId, contractorId }) => {
  const { keycloak } = useKeycloak();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});
  const [selectedTraitResult, setSelectedTraitResult] = useState(null);

  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [traitDetailsTabsValue, setTraitDetailsTabsValue] = useState(0);

  const handleChangeTraitDetailsTabs = (event, newValue) => {
    setTraitDetailsTabsValue(newValue);
  };

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
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

  let selectedPeraAssessment = missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree[selectedIndex];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} />
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
                        <ListItemButton key={index} selected={selectedIndex === index} onClick={() => handleListItemClick(index)}>
                          <ListItemIcon>
                            <RightOutlined />
                          </ListItemIcon>
                          <ListItemText primary={item?.linkedAssessment?.assessment?.name} />
                        </ListItemButton>
                      );
                    })}
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
            {selectedPeraAssessment &&
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
                    <Typography variant="h4">Results</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{selectedPeraAssessment?.linkedAssessment?.assessment?.hrPage?.body}</Typography>
                  </Grid>

                  {selectedPeraAssessment?.traitResults?.map((item, index) => {
                    return (
                      <Grid key={index} item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={3}>
                            <ButtonBase component={Link} onClick={() => { handleOpenTraitDetails(item); }} underline="none">
                              <Typography variant="h5" sx={{ mr: 1.25 }}>{item?.trait?.hrPage?.title}</Typography>
                              <RightOutlined />
                            </ButtonBase>
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <LinearWithLabel value={item?.percentile * 100} />
                          </Grid>
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
        <DialogTitle>{selectedTraitResult?.trait?.hrPage?.title}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Typography paragraph="true">{selectedTraitResult?.trait?.hrPage?.body}</Typography>
          <Typography variant="caption" paragraph="true">
            Other associated competencies:
            {selectedTraitResult?.trait?.relatedTraits?.map((item, index) => { return ' ' + item?.hrPage?.title + (index < selectedTraitResult?.trait?.relatedTraits?.length - 1 ? ',' : ''); })}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs value={traitDetailsTabsValue} onChange={handleChangeTraitDetailsTabs} variant="scrollable" scrollButtons="auto">
              <Tab label="Growth tip" component={Link} icon={<RiseOutlined />} iconPosition="start" />
              <Tab label="Follow-up questions" component={Link} icon={<QuestionOutlined />} iconPosition="start" />
            </Tabs>
          </Box>
          {traitDetailsTabsValue === 0 && 
            <Box sx={{ mt: 2.5 }}>
              {selectedTraitResult?.trait?.tips?.map((tip) => {
                return (
                  <>
                    <Typography variant="h5">{tip?.title}</Typography>
                    <Typography paragraph="true">{tip?.body}</Typography>
                  </>
                );
              })}
            </Box>
          }
          {traitDetailsTabsValue === 1 &&
            <Box sx={{ mt: 2.5 }}>
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
        </DialogContent>
      </Dialog>

    </Grid>
  );
};

export default MissionContractorMatch;
