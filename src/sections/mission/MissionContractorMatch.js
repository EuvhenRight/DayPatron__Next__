import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import {
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';
import { LinkedinOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { getEllipsis } from 'utils/stringUtils';
import countries from 'data/countries';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| MISSION CONTRACTOR MATCH ||============================== //

const MissionContractorMatch = ({ missionId, contractorId }) => {
  const { keycloak } = useKeycloak();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});

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
    })();
  }, []);

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
              </Grid>
            </MainCard>
          </Grid>
        </Grid>

      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              {missionContractorMatch?.contractor?.firstName}
              {missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree?.map((item, index) => {
                return (
                  <LinearWithLabel key={index} value={item?.percentile * 100} />
                );
              })}
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MissionContractorMatch;
