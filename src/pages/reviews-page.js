import { Grid, Typography } from '@mui/material';
import { ReviewsContextProvider } from 'sections/review/ReviewsContext';
import Reviews from 'sections/review/Reviews';

import { useSelector } from 'react-redux';

const ReviewsPage = () => {
  const personalInformation = useSelector((state) => state.personalInformation);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant='h3'>Reviews about me</Typography>
      </Grid>
      <Grid item xs={12}>
        <ReviewsContextProvider targetItemType="Contractor" targetItemId={personalInformation?.id}>
          <Reviews isReadOnly={true} />
        </ReviewsContextProvider>
      </Grid>
    </Grid>
  );
};

export default ReviewsPage;
