import PropTypes from 'prop-types';

// material-ui
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// ==============================|| PROGRESS - LINEAR WITH LABEL ||============================== //
const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 15
}));

export default function LinearWithLabel({ value, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <StyledLinearProgress variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number
};
