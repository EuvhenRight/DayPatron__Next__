// material-ui
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
  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard title="Total Missions Applied" count="78,250" percentage={70.5}>
          <TotalMissionsAppliedCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard title="Total Missions Accepted" count="78,250" percentage={70.5} isLoss color="warning">
          <TotalMissionsAcceptedCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard title="Number of Hours" count="78,250" percentage={70.5}>
          <TotalHoursCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticsDataCard title="Earnings" count="&euro;78,250" percentage={70.5} isLoss color="warning">
          <EarningsCardChart />
        </AnalyticsDataCard>
      </Grid>

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Missions</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <RecentMissionsList />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        <PayoutHistory />
      </Grid>

    </Grid>
  );
};

export default DashboardPage;
