import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';

import { Grid, Typography, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/dashboard/analytics/WelcomeBanner';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';
import TotalMissionsAppliedCardChart from 'sections/dashboard/analytics/TotalMissionsAppliedCardChart';
import TotalMissionsAcceptedCardChart from 'sections/dashboard/analytics/TotalMissionsAcceptedCardChart';
import TotalProductsSoldCardChart from 'sections/dashboard/analytics/TotalProductsSoldCardChart';
import TotalHoursCardChart from 'sections/dashboard/analytics/TotalHoursCardChart';
import EarningsCardChart from 'sections/dashboard/analytics/EarningsCardChart';
import RecentMissionsList from 'sections/dashboard/analytics/RecentMissionsList';
import PayoutHistory from 'sections/dashboard/analytics/PayoutHistory';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DashboardPage = () => {
  const now = new Date();
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0));
  const [endDate, setEndDate] = useState(new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999));
  const [state, setState] = useState(null);

  const bindData = async () => {
    try {
      let apiEndpointUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + personalInformation.id + '/missions/statistics?1=1';
      
      if(startDate)
        apiEndpointUrl += '&startDate=' + startDate.toISOString();

      if(endDate)
        apiEndpointUrl += '&endDate=' + endDate.toISOString();

      let response = await fetch(apiEndpointUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setState(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      if (personalInformation.id) {
        await bindData();
      }
    })();
  }, [personalInformation?.id, keycloak?.idToken, startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner />
        </Grid>
        <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start date"
            value={startDate}
            onChange={(startDateValue) => {
              setStartDate(startDateValue);
            }}
            format="dd-MM-yyyy" />
          <DatePicker
            label="End date"
            value={endDate}
            onChange={(endDateValue) => {
              let newValue = new Date(endDateValue.getFullYear(), endDateValue.getMonth(), endDateValue.getDate(), 23, 59, 59, 999);
              setEndDate(newValue);
            }}
            format="dd-MM-yyyy" />
        </Stack>
        </Grid>
        {state && <>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsDataCard title="Total Missions Applied" count={state?.totalMissionsApplied}>
              <TotalMissionsAppliedCardChart months={state?.applicationsPerMonth} />
            </AnalyticsDataCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsDataCard title="Total Missions Accepted" count={state?.totalMissionsApproved}>
              <TotalMissionsAcceptedCardChart months={state?.approvalsPerMonth} />
            </AnalyticsDataCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsDataCard title="Total Solutions Sold" count={state?.totalProductsSold}>
              <TotalProductsSoldCardChart months={state?.productsSoldPerMonth} />
            </AnalyticsDataCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsDataCard title="Number of Hours" count={state?.totalNumberOfHours}>
              <TotalHoursCardChart months={state?.hoursPerMonth} />
            </AnalyticsDataCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsDataCard title="Earnings" countPrefix="&euro;" count={state?.totalEarnings}>
              <EarningsCardChart months={state?.earningsPerMonth} />
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
            <PayoutHistory payoutHistoryData={state?.recentInvoices} />
          </Grid>
        </>}

      </Grid>
    </LocalizationProvider>
  );
};

export default DashboardPage;
