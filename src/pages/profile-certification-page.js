import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Grid,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';
import { FileDoneOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const ProfileCertificationPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [certificationResponse, setCertificationResponse] = useState(null);
  
  const bindCertification = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/professional-certifications',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setCertificationResponse(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindCertification();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  if (!(certificationResponse?.professionalCertifications?.length > 0))
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
        {certificationResponse?.professionalCertifications?.map((certification, certificationIndex) => {
          return (<Grid key={certificationIndex} item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <FileDoneOutlined style={{ fontSize: '3rem' }}  />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5">
                  {certification?.name}
                </Typography>
                <Typography variant="h6">
                  {certification?.authority}
                </Typography>
                <Typography color="secondary">
                  {format(new Date(certification?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{certification?.endDateUtc ? format(new Date(certification?.endDateUtc), 'MMM y') : 'Present'}
                </Typography>
                <Typography color="secondary">
                  {certification?.url}
                </Typography>
              </Grid>
            </Grid>
          </Grid>);
        })}
      </Grid>

    </MainCard>
  );
};

export default ProfileCertificationPage;
