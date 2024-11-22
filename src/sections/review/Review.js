import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Grid, Rating, Stack, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const Review = ({ avatar, date, name, rating, review }) => (
  <Grid item xs={12}>
    <Stack direction="row" spacing={1}>
      <Avatar alt={name} src={avatar} />
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {date ? format(new Date(date), "yyyy-MM-dd hh:mm:ss") : ''}
          </Typography>
          <Rating
            size="small"
            name="simple-controlled"
            value={rating}
            icon={<StarFilled style={{ fontSize: 'inherit' }} />}
            emptyIcon={<StarOutlined style={{ fontSize: 'inherit' }} />}
            precision={0.1}
            readOnly
          />
        </Stack>
        <Typography variant="body2">{review}</Typography>
      </Stack>
    </Stack>
  </Grid>
);

Review.propTypes = {
  avatar: PropTypes.string,
  date: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  review: PropTypes.string
};

export default Review;
