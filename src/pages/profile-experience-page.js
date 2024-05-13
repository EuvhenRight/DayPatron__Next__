import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Grid,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';
import { ShopOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import SanitizedHTML from 'react-sanitized-html';

const ProfileExperiencePage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [experienceResponse, setExperienceResponse] = useState(null);
  
  const bindExperience = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/professional-experiences',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setExperienceResponse(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindExperience();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  if (!(experienceResponse?.professionalExperiences?.length > 0))
    return (
      <MainCard>
        <Typography>
          No data.
        </Typography>
      </MainCard>
    );

  return (
    <MainCard>
      <Grid container spacing={3}>
        {experienceResponse?.professionalExperiences?.map((professionalExperience, professionalExperienceIndex) => {
          return (<Grid key={professionalExperienceIndex} item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                {professionalExperience?.companyLogoUrl ? 
                (
                  <img
                    style={{ width: 50, height: 50, textDecoration: 'none', opacity: 1 }}
                    alt={professionalExperience?.company}
                    src={professionalExperience?.companyLogoUrl}
                  />
                ) : 
                (
                  <ShopOutlined style={{ fontSize: '3rem' }}  />
                )}
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5">
                  {professionalExperience?.title}
                </Typography>
                <Typography variant="h6">
                  {professionalExperience?.company}
                </Typography>
                <Typography color="secondary">
                  {professionalExperience?.location}
                </Typography>
                <Typography color="secondary">
                  {format(new Date(professionalExperience?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{professionalExperience?.endDateUtc ? format(new Date(professionalExperience?.endDateUtc), 'MMM y') : 'Present'}
                </Typography>
                <SanitizedHTML html={professionalExperience?.description} />
              </Grid>
            </Grid>
          </Grid>);
        })}
      </Grid>
    </MainCard>
  );
};

export default ProfileExperiencePage;
