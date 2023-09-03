// material-ui
import { Grid, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';

// ==============================|| ANALYTICS - WELCOME ||============================== //

const WelcomeBanner = ({title, subTitle}) => {
  const theme = useTheme();

  return (
    <MainCard
      border={false}
      sx={{
        background:
          theme.direction === 'rtl'
            ? `linear-gradient(60.38deg, ${theme.palette.primary.lighter} 114%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
            : `linear-gradient(250.38deg, ${theme.palette.primary.lighter} 2.39%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
      }}
    >
      <Grid container>
        <Grid item md={6} sm={6} xs={12}>
          <Stack spacing={2} sx={{ padding: 3.4 }}>
            <Typography variant="h2" color={theme.palette.background.paper}>
              {title}
            </Typography>
            <Typography variant="h6" color={theme.palette.background.paper}>
              {subTitle}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default WelcomeBanner;
