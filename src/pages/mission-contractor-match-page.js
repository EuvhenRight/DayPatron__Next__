import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation, useParams, Link, Outlet  } from 'react-router-dom';
import countries from 'data/countries';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Button,
  Grid,
  Stack,
  Typography,
  Box, 
  Tab, 
  Tabs,
  useMediaQuery
} from '@mui/material';

import MissionContractorMatchDetails from 'sections/mission/MissionContractorMatchDetails';
import { EnvironmentOutlined, EuroOutlined, FileTextOutlined, MessageOutlined, RobotOutlined, CalendarOutlined, FileDoneOutlined, BulbOutlined } from '@ant-design/icons';

import Avatar from 'components/@extended/Avatar';
import { PopupModal } from "react-calendly";

const MissionContractorMatchPage = () => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const navigate = useNavigate();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});
  const [missionContractor, setMissionContractor] = useState(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const personalInformation = useSelector(state => state.personalInformation);
  let { missionId, contractorId } = useParams();
  const { pathname } = useLocation();
  const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  let selectedTab = 0;
  if (pathname.endsWith('/ai-screening')) {
    selectedTab = 1;
  }

  const bindMissionContractor = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMissionContractor(json);
    } catch (error) {
      console.log(error);
    }
  }

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

  useEffect(() => {
    (async () => {
      await bindMissionContractorMatch();
      await bindMissionContractor();
    })();
  }, [keycloak?.idToken, contractorId, missionId]);

  return (
    <Grid container spacing={2.5} sx={{position: 'relative'}}>
      
      <Grid item xs={matchDownSm ? 12 : null}>
        <Stack direction="row" justifyContent="center">
          <Avatar src={missionContractorMatch?.contractor?.mainImageUrl} size={matchDownSm ? 'xxxxl' : 'xxxl'} />
        </Stack>
      </Grid>
      <Grid item xs zeroMinWidth>
        <Stack alignItems={matchDownSm ? 'center' : 'default'} spacing={0.5}>
          <Typography variant='h3'>{missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName}</Typography>
          <Typography variant="h6">{missionContractorMatch?.contractor?.headline}</Typography>
          <Grid container sx={{ justifyContent: {xs: "center", sm: "flex-start"}, alignItems: "center"}}>
            {missionContractorMatch?.contractor?.country && 
              <Grid item sx={{mr: 1.5}}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EnvironmentOutlined />
                  <Typography color="secondary">
                    {countries.find(x => x.code === missionContractorMatch?.contractor?.country)?.label}
                  </Typography>
                </Stack>
              </Grid>
            }
            {missionContractorMatch?.contractor?.preferences?.rate?.lowerLimitWithMargin && 
              <Grid item sx={{mr: 1.5}}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EuroOutlined />
                  <Typography color="secondary">
                    {missionContractorMatch?.contractor?.preferences?.rate?.lowerLimitWithMargin} - {missionContractorMatch?.contractor?.preferences?.rate?.upperLimitWithMargin} / hour
                  </Typography>
                </Stack>
              </Grid>
            }
            {missionContractorMatch?.contractor?.expertise?.startYear && 
              <Grid item sx={{mr: 1.5}}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <FileDoneOutlined />
                  <Typography color="secondary">
                    {new Date().getFullYear() - missionContractorMatch?.contractor?.expertise?.startYear + ' year(s) experience'}
                  </Typography>
                </Stack>
              </Grid>
            }
          </Grid>
          
          <Grid container sx={{ justifyContent: {xs: "center", sm: "flex-start"}, alignItems: "center"}}>
            <Grid item sx={{mr: 1.5}}>
              <Button 
                sx={{ width: '100px', height: '27px', marginBottom: 1.5}}
                startIcon={<MessageOutlined />}
                variant="contained" 
                onClick={() => {navigate('/messaging', { state: { targetUserId: missionContractorMatch?.contractor?.messagingProviderUserId} })}}>
                Message
              </Button>
            </Grid>
            {missionContractorMatch?.contractor?.calendlyUrl &&
              <Grid item sx={{mr: 1.5}}>
                <Button 
                  color="secondary"
                  variant="contained" 
                  startIcon={<CalendarOutlined />}
                  onClick={() => { setIsCalendlyOpen(true); }} 
                  sx={{ width: '182px', height: '27px', marginBottom: 1.5}}>
                  Schedule a Meeting
                </Button>
                <PopupModal
                  url={missionContractorMatch?.contractor?.calendlyUrl}
                  onModalClose={() => { setIsCalendlyOpen(false); }}
                  open={isCalendlyOpen}
                  rootElement={document.getElementById("root")}
                  prefill={{
                    email: personalInformation?.email,
                    firstName: personalInformation?.firstName,
                    lastName: personalInformation?.lastName,
                    name: personalInformation?.firstName + ' ' + personalInformation?.lastName,
                    date: new Date(Date.now() + 86400000)
                  }}
                  pageSettings={{
                    backgroundColor: theme.palette.common.white,
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: theme.palette.primary.main,
                    textColor: theme.palette.text.primary
                  }}
                />
              </Grid>
            }
            <MissionContractorMatchDetails 
              missionContractorMatch={missionContractorMatch} 
              setMissionContractorMatch={setMissionContractorMatch} 
              missionId={missionId} 
              contractorId={contractorId} 
              missionContractor={missionContractor}
              setMissionContractor={setMissionContractor} />
          </Grid>
          
        </Stack>
      </Grid>
      {missionContractorMatch?.contractor?.summary &&
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{marginTop: 0.5, marginBottom: 0.5}}> 
                <BulbOutlined style={{fontSize: 25, marginTop: "2px", marginRight: "5px"}} />
                <Typography>{missionContractorMatch?.contractor?.summary}</Typography>
              </Stack>
              
            </Grid>
          </Grid>
        </Grid>
      }
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={selectedTab} variant="scrollable" scrollButtons="auto" aria-label="mission tabs">
            <Tab label="Experience" component={Link} to={'/missions/' + missionId + '/matches/' + contractorId + '/experience'} icon={<FileTextOutlined />} iconPosition="start" />
            <Tab label="AI Screening" component={Link} to={'/missions/' + missionId + '/matches/' + contractorId + '/ai-screening'} icon={<RobotOutlined />} iconPosition="start" />
          </Tabs>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Outlet context={[missionContractorMatch]} />
      </Grid>
    </Grid>
  );
};

export default MissionContractorMatchPage;
