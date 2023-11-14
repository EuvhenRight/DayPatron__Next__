import PropTypes from 'prop-types';
// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// project import
import EmptyCard from './EmptyCard';

// ==============================|| EMPTY STATE ||============================== //

const EmptyCardList = ({ title }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            pt: { xs: 2 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'transparent'
          }}
        >
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Box sx={{ ml: -9, mb: { xs: -10, sm: -8 } }}>
                <Box sx={{ position: 'relative' }}>
                  <EmptyCard />
                </Box>
                <Box sx={{ position: 'relative', top: -110, left: 72 }}>
                  <EmptyCard />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Stack spacing={1}>
                <Typography align="center" variant="h5">
                  {title}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

EmptyCardList.propTypes = {
  title: PropTypes.string
};

export default EmptyCardList;
