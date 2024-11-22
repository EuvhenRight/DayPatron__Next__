import { useContext } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Grid, LinearProgress, Rating, Stack, Typography } from '@mui/material';

import Review from 'sections/review/Review';
import MainCard from 'components/MainCard';

import { StarFilled, StarOutlined } from '@ant-design/icons';
import { ReviewsContext } from 'sections/review/ReviewsContext';
import AddReview from './AddReview';

function LinearProgressWithLabel({ star, color, value, ...others }) {
  if (!value) value = 0;

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <LinearProgress
          value={value}
          variant="determinate"
          color={color}
          {...others}
          sx={{ width: '100%', bgcolor: 'secondary.lighter' }}
        />
        <Typography variant="body2" sx={{ minWidth: 50 }} color="textSecondary">{`${Math.round(star)} Star`}</Typography>
      </Stack>
    </>
  );
}

LinearProgressWithLabel.propTypes = {
  star: PropTypes.number,
  color: PropTypes.string,
  value: PropTypes.number
};

const Reviews = ({isReadOnly}) => {
  const theme = useTheme();
  const { reviewData } = useContext(ReviewsContext);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard>
          <Grid container justifyContent="space-between" alignItems="center" spacing={2.5}>
            <Grid item>
              {reviewData && (
                <Stack spacing={1} sx={{ height: '100%' }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h2">{reviewData?.totalScore ? Number(reviewData.totalScore.toFixed(1)) : '-'}</Typography>
                      <Typography variant="h4" color="textSecondary">
                        /{reviewData?.maxScore}
                      </Typography>
                    </Stack>
                    <Typography color="textSecondary">
                      Based on {reviewData?.totalCount} review{reviewData?.totalCount === 1 ? '' : 's'}
                    </Typography>
                  </Stack>
                  <Rating
                    value={reviewData?.totalScore}
                    icon={<StarFilled style={{ fontSize: 'inherit' }} />}
                    emptyIcon={<StarOutlined style={{ fontSize: 'inherit' }} />}
                    readOnly
                    precision={0.1}
                  />
                </Stack>
              )}
            </Grid>
            <Grid item>
              <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                <Grid item xs={12}>
                  <LinearProgressWithLabel color="warning" star={5} value={reviewData?.fiveScoreCount} />
                </Grid>
                <Grid item xs={12}>
                  <LinearProgressWithLabel color="warning" star={4} value={reviewData?.fourScoreCount} />
                </Grid>
                <Grid item xs={12}>
                  <LinearProgressWithLabel color="warning" star={3} value={reviewData?.threeScoreCount} />
                </Grid>
                <Grid item xs={12}>
                  <LinearProgressWithLabel color="warning" star={2} value={reviewData?.twoScoreCount} />
                </Grid>
                <Grid item xs={12}>
                  <LinearProgressWithLabel color="warning" star={1} value={reviewData?.oneScoreCount} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {reviewData?.reviews &&
        reviewData?.reviews.map((review, index) => (
          <Grid item xs={12} key={index}>
            <MainCard sx={{ bgcolor: theme.palette.grey.A50 }}>
              <Review
                date={review?.createdOnUtc}
                name={review?.sourceUserFullName}
                rating={review?.score}
                review={review?.body}
                avatar={review?.sourceUserMainImageUrl}
              />
            </MainCard>
          </Grid>
        ))}

      {!isReadOnly && (
        <Grid item xs={12}>
          <AddReview />
        </Grid>
      )}
    </Grid>
  );
};

export default Reviews;
