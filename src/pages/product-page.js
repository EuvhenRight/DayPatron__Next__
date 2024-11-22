import MainCard from 'components/MainCard';
import UpsertProduct from 'sections/product/UpsertProduct';
import { useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';

import { ReviewsContextProvider } from 'sections/review/ReviewsContext';
import Reviews from 'sections/review/Reviews';


const ProductPage = () => {
  let { productId } = useParams();

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <MainCard>
          <UpsertProduct productId={productId} />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h3'>Reviews</Typography>
      </Grid>
      <Grid item xs={12}>
        <ReviewsContextProvider targetItemType="Product" targetItemId={productId}>
          <Reviews isReadOnly={true} />
        </ReviewsContextProvider>
      </Grid>
    </Grid>
  );
};

export default ProductPage;
