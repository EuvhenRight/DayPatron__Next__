import ProductOrders from 'sections/order/ProductOrders';
import MissionOrders from 'sections/order/MissionOrders';
import {
  Typography,
  Grid
} from '@mui/material';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

const OrdersPage = () => {
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <WelcomeBanner title="Order Management" subTitle="Streamlined Order Management and Collaboration" />
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          With each order you place, a symphony of automation comes to life. Every order undergoes scrutiny by our team, guaranteeing it contains what has been discussed. As the i&apos;s are dotted and the t&apos;s are crossed, you&apos;re presented with a Service Order. This Service Order is approved by us and you. Every service order has a partner in the form of a project order. This project order connects your order to a specific 10x-er. It&apos;s here that the final chords are struck and ensuring that regulations are met.
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3">Product Orders</Typography>
        <ProductOrders></ProductOrders>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3">Mission Orders</Typography>
        <MissionOrders></MissionOrders>
      </Grid>
    </Grid>
  );
};

export default OrdersPage;
