import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation, useParams, Link, Outlet  } from 'react-router-dom';
import countries from 'data/countries';
import jobRoles from 'data/jobRoles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Grid,
  Stack,
  Typography,
  Box, 
  Tab, 
  Tabs,
  Chip,
  useMediaQuery
} from '@mui/material';
import MissionContractorMatchDetails from 'sections/mission/MissionContractorMatchDetails';

import MainCard from 'components/MainCard';

import { EnvironmentOutlined, EuroOutlined, FileTextOutlined, MessageOutlined, RobotOutlined } from '@ant-design/icons';

import Avatar from 'components/@extended/Avatar';

const MissionContractorMatchPage = () => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const navigate = useNavigate();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});
  const [missionContractor, setMissionContractor] = useState(null);
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
    <Grid container spacing={3}>

      <Grid item xs={12} md={9}>

        <Grid container spacing={3} sx={{position: 'relative'}}>
          
          <Grid item xs={matchDownSm ? 12 : null}>
            <Stack direction="row" justifyContent="center">
              <Avatar src={missionContractorMatch?.contractor?.mainImageUrl} size={matchDownSm ? 'xxxxl' : 'xxxl'} />
              
              <Button 
                startIcon={<MessageOutlined />}
                variant="contained" 
                sx={{position: 'absolute',  right: '3px', top: '24px'}} 
                onClick={() => {navigate('/messaging', { state: { targetUserId: missionContractorMatch?.contractor?.messagingProviderUserId} })}}>
                Message
              </Button>
            </Stack>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Stack alignItems={matchDownSm ? 'center' : 'default'}>
              <Typography variant='h3'>{missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName}</Typography>
              <Typography variant="h6">{missionContractorMatch?.contractor?.headline}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EnvironmentOutlined />
                  <Typography color="secondary">
                    {countries.find(x => x.code === missionContractorMatch?.contractor?.country)?.label}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EuroOutlined />
                  <Typography color="secondary">
                    {missionContractorMatch?.contractor?.preferences?.rate?.lowerLimitWithMargin} - {missionContractorMatch?.contractor?.preferences?.rate?.upperLimitWithMargin}
                  </Typography>
                </Stack>
              </Stack>
              <div>
                {missionContractorMatch?.contractor?.expertise?.jobRoles?.map((jobRole, jobRoleIndex) => 
                  {
                    return (
                      <Chip sx={{float: 'left', marginTop: '5px', marginRight: '5px'}} key={jobRoleIndex} color="primary" variant="outlined" size="small" label={jobRoles.find(x => x.code === jobRole)?.shortLabel} />
                    );
                  }
                )}
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              {missionContractorMatch?.contractor?.summary}
            </Typography>
          </Grid>
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
      </Grid>
      <Grid item xs={12} md={3}>
        <MainCard>
          <MissionContractorMatchDetails 
            missionContractorMatch={missionContractorMatch} 
            setMissionContractorMatch={setMissionContractorMatch} 
            missionId={missionId} 
            contractorId={contractorId} 
            missionContractor={missionContractor}
            setMissionContractor={setMissionContractor} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default MissionContractorMatchPage;
