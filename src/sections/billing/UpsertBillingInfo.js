import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//material-ui
import {
  Typography,
  Grid,
  Stack
} from '@mui/material'

// assets
import { useKeycloak } from '@react-keycloak/web';

// project import
import MainCard from 'components/MainCard';
import InvoiceDetails from 'sections/billing/InvoiceDetails';

// third-party
import { format } from 'date-fns';


// ==============================|| BILLINGINFO VIEW / EDIT ||============================== //

const UpsertBillingInfo = ({ billingInfoId }) => {
  const { keycloak } = useKeycloak();
  const [billingInfo, setBillingInfo] = useState([]);

  const onInvoiceUpdated = async () => {
    bindBillingInfo();
  }

  const bindBillingInfo = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing/' + encodeURIComponent(billingInfoId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          }
        }
      );
      let json = await response.json();

      setBillingInfo(json.billingInfo);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      if (billingInfoId) {
        await bindBillingInfo();
      }
    })();
  }, [billingInfoId, keycloak?.idToken]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3">Billing Info</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Id</Typography>
                <Typography variant="subtitle2">{billingInfo?.id}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Billing Period</Typography>
                <Typography variant="subtitle2">{billingInfo?.startDate && format(new Date(billingInfo?.startDate), "yyyy-MM-dd")} - {billingInfo?.endDate && format(new Date(billingInfo?.endDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Name</Typography>
                <Typography variant="subtitle2">{billingInfo?.itemName}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Status</Typography>
                <Typography variant="subtitle2">{billingInfo?.billingStatus}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Creation Date</Typography>
                <Typography variant="subtitle2">{billingInfo?.createdAtUtc && format(new Date(billingInfo?.createdAtUtc), "yyyy-MM-dd HH:mm:ss")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Mission Order Id</Typography>
                <Typography variant="subtitle2">{billingInfo?.missionOrderId}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Employer Name</Typography>
                <Typography variant="subtitle2">{billingInfo?.employerName}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Contractor Name</Typography>
                <Typography variant="subtitle2">{billingInfo?.contractorName}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Product Order Id</Typography>
                <Typography variant="subtitle2">{billingInfo?.productOrderId}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total Amount Employer</Typography>
                <Typography variant="subtitle2">€ {billingInfo?.totalAmountEmployer?.toFixed(2).replace(".", ",")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total Amount Talent</Typography>
                <Typography variant="subtitle2">€ {billingInfo?.totalAmountContractor?.toFixed(2).replace(".", ",")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Gross Margin 10x</Typography>
                <Typography variant="subtitle2">€ {billingInfo?.grossMargin10x?.toFixed(2).replace(".", ",")}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {billingInfo?.invoices?.map((invoice, index) => (
        <Grid key={index} item xs={12} md={6}>
          <InvoiceDetails invoice={invoice} onInvoiceUpdated={onInvoiceUpdated} />
        </Grid>
      ))}
    </Grid>
  );
};

UpsertBillingInfo.propTypes = {
  billingInfoId: PropTypes.string
};

export default UpsertBillingInfo;