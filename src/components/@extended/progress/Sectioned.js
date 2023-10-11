import PropTypes from 'prop-types';

// material-ui
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// ==============================|| PROGRESS - LINEAR WITH LABEL ||============================== //
const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 30
}));

export default function Sectioned({ value }) {

  const getSectionValue = (index, percentage) => {
    if (!percentage)
      return 0;

    let totalPercentage = percentage / 0.2;
    let leftOver = totalPercentage - index * 100;

    if (leftOver >= 100)
      return 100;
    else if (leftOver < 0)
      return 0;

    return leftOver;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '20%', mr: 1 }}>
        <Stack textAlign="center">
          <StyledLinearProgress variant="determinate" value={getSectionValue(0, value)} />
          <Typography variant="caption">Below par</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '20%', mr: 1 }}>
        <Stack textAlign="center">
          <StyledLinearProgress variant="determinate" value={getSectionValue(1, value)} />
          <Typography variant="caption">Potential</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '20%', mr: 1 }}>
        <Stack textAlign="center">
          <StyledLinearProgress variant="determinate" value={getSectionValue(2, value)} />
          <Typography variant="caption">Good</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '20%', mr: 1 }}>
        <Stack textAlign="center">
          <StyledLinearProgress variant="determinate" value={getSectionValue(3, value)} />
          <Typography variant="caption">Very good</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '20%', mr: 1 }}>
        <Stack textAlign="center">
          <StyledLinearProgress variant="determinate" value={getSectionValue(4, value)} />
          <Typography variant="caption">Excellent</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

Sectioned.propTypes = {
  value: PropTypes.number
};
