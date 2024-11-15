import { useParams } from 'react-router-dom';

import ContractorSubscriptionServiceOrder from 'sections/order/ContractorSubscriptionServiceOrder';

const ContractorSubscriptionServiceOrderPage = () => {
  let { orderId, role } = useParams();

  return (<ContractorSubscriptionServiceOrder orderId={orderId} userRole={role}/>);
};

export default ContractorSubscriptionServiceOrderPage;