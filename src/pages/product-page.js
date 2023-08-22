import MainCard from 'components/MainCard';
import UpsertProduct from 'sections/product/UpsertProduct';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  let { productId } = useParams();

  return (
    <MainCard>
      <UpsertProduct productId={productId} />
    </MainCard>
  );
};

export default ProductPage;
