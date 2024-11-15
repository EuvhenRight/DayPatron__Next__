import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Grid, Typography, Stack } from '@mui/material';
import TenxChat from 'sections/messaging/TenxChat';
import ContractorSubscriptionServiceOrder from 'sections/order/ContractorSubscriptionServiceOrder';

const SubscriptionOrderTermsPage = () => {
  const { keycloak } = useKeycloak();
  let { subscriptionOrderId: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [targetEntity, setTargetEntity] = useState(null);

  useEffect(() => {
    (async () => {
      if(orderId)
        await bindOrder();
    })();
  }, [orderId, keycloak?.idToken]);

  const bindOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + orderId + '/terms', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });

      let json = await response.json();

      setOrder(json);
      setTargetEntity(json ? {targetUserIds: [json.contractorMessagingProviderUserId, ...json.employerMessagingProviderUserIds]} : null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}
    >
      <Grid item xs={12} md={8}>
        <Stack spacing={1}>
          <Typography variant="h4">Order terms</Typography>
          <ContractorSubscriptionServiceOrder orderId={order?.id} userRole="contractor" isEditable={true} hideTitle={true} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={1}>
          <Typography variant="h4">Chat with talent</Typography>
          
          <TenxChat targetEntity={targetEntity} setTargetEntity={setTargetEntity} showSingleChannel={true} />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SubscriptionOrderTermsPage;
