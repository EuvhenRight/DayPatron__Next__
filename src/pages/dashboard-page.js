import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/dashboard/analytics/WelcomeBanner';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';
import TotalMissionsAppliedCardChart from 'sections/dashboard/analytics/TotalMissionsAppliedCardChart';
import TotalMissionsAcceptedCardChart from 'sections/dashboard/analytics/TotalMissionsAcceptedCardChart';
import TotalHoursCardChart from 'sections/dashboard/analytics/TotalHoursCardChart';
import EarningsCardChart from 'sections/dashboard/analytics/EarningsCardChart';
import RecentMissionsList from 'sections/dashboard/analytics/RecentMissionsList';
import PayoutHistory from 'sections/dashboard/analytics/PayoutHistory';

const DashboardPage = () => {
  const { keycloak } = useKeycloak();

  const [state, setState] = useState(null);

  const bindData = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/static-data',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setState(json?.staticData?.dashboard);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>
      {state && <>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticsDataCard title="Total Missions Applied" count={state?.missionsApplied?.totalAmount}>
            <TotalMissionsAppliedCardChart months={state?.missionsApplied?.months} />
          </AnalyticsDataCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticsDataCard title="Total Missions Accepted" count={state?.missionsAccepted?.totalAmount}>
            <TotalMissionsAcceptedCardChart months={state?.missionsAccepted?.months} />
          </AnalyticsDataCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticsDataCard title="Number of Hours" count={state?.numberOfHours?.totalAmount}>
            <TotalHoursCardChart months={state?.numberOfHours?.months} />
          </AnalyticsDataCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticsDataCard title="Earnings" count={`\u20AC${state?.earnings?.totalAmount}`}>
            <EarningsCardChart months={state?.earnings?.months} />
          </AnalyticsDataCard>
        </Grid>
        {state?.recentMissions?.length > 0 &&
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Recent Missions</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <RecentMissionsList recentMissionsData={state?.recentMissions} />  
            </MainCard>
          </Grid>
        }
        <Grid item xs={12} md={5} lg={4}>
          <PayoutHistory payoutHistoryData={state?.payoutHistory} />
        </Grid>
      </>}

    </Grid>
  );
};

export default DashboardPage;
