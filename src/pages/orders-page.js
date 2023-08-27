import ProductOrders from 'sections/order/ProductOrders';
import MissionOrders from 'sections/order/MissionOrders';
import {
  Typography
} from '@mui/material';

const OrdersPage = () => {
  
  return (
    <>
      <Typography variant="h3">Product Orders</Typography>
      <ProductOrders></ProductOrders>

      <Typography variant="h3">Mission Orders</Typography>
      <MissionOrders></MissionOrders>
    </>
  );
};

export default OrdersPage;
