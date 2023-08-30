import { useParams } from 'react-router-dom';
import UpdateProductOrder from 'sections/order/UpdateProductOrder';

// project import
import MainCard from 'components/MainCard';

const ProductOrderPage = () => {
  const { productOrderId } = useParams();

  return (
    <MainCard>
      <UpdateProductOrder productOrderId={productOrderId}></UpdateProductOrder>
    </MainCard>
  );
};

export default ProductOrderPage;
