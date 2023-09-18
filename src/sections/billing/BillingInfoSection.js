import UpsertBillingInfo from 'sections/billing/UpsertBillingInfo';
import { useParams } from 'react-router-dom';

const BillingInfoSection = () => {
  let { id } = useParams();

  return (
    <UpsertBillingInfo billingInfoId={id} />
  )
};

export default BillingInfoSection;