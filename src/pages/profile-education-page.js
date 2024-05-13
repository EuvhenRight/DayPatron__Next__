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

const ProfileEducationPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [educationResponse, setEducationResponse] = useState(null);
  
  const bindEducation = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/professional-educations',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setEducationResponse(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindEducation();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  if (!(educationResponse?.educations?.length > 0))
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
        {educationResponse?.educations?.map((education, educationIndex) => {
          return (<Grid key={educationIndex} item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                {education?.schoolLogoUrl ? 
                (
                  <img
                    style={{ width: 50, height: 50, textDecoration: 'none', opacity: 1 }}
                    alt={education?.school}
                    src={education?.schoolLogoUrl}
                  />
                ) : 
                (
                  <ShopOutlined style={{ fontSize: '3rem' }}  />
                )}
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5">
                  {education?.degreeName}
                </Typography>
                <Typography variant="h6">
                  {education?.school}
                </Typography>
                <Typography color="secondary">
                  {education?.fieldOfStudy}
                </Typography>
                <Typography color="secondary">
                  {format(new Date(education?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{education?.endDateUtc ? format(new Date(education?.endDateUtc), 'MMM y') : 'Present'}
                </Typography>
                <SanitizedHTML html={education?.description} />
              </Grid>
            </Grid>
          </Grid>);
        })}
      </Grid>

    </MainCard>
  );
};

export default ProfileEducationPage;
