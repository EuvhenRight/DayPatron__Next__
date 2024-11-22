import { useContext } from 'react';
import { Rating, Stack, Typography } from '@mui/material';
import { ReviewsContext } from 'sections/review/ReviewsContext';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const ReviewsOverview = ({ iconSize }) => {
  
  const { reviewData } = useContext(ReviewsContext);
  if(!reviewData?.totalScore)
    return <></>;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Rating
        value={reviewData?.totalScore}
        icon={<StarFilled style={{ fontSize: iconSize ?? 'inherit' }} />}
        emptyIcon={<StarOutlined style={{ fontSize: iconSize ?? 'inherit' }} />}
        precision={0.1}
        readOnly
      />
      <Typography color="textSecondary">({reviewData?.totalScore?.toFixed(1)})</Typography>
    </Stack>
  );
};

export default ReviewsOverview;
