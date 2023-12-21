import { useParams } from 'react-router-dom';
import UpdateSubscriptionOrder from 'sections/order/UpdateSubscriptionOrder';

// project import
import MainCard from 'components/MainCard';

const SubscriptionOrderPage = () => {
  const { subscriptionOrderId } = useParams();

  return (
    <MainCard>
      <UpdateSubscriptionOrder subscriptionOrderId={subscriptionOrderId}></UpdateSubscriptionOrder>
    </MainCard>
  );
};

export default SubscriptionOrderPage;
