// material-ui
import { Grid, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import WelcomeImage from 'assets/images/welcome.png';

// ==============================|| ANALYTICS - WELCOME ||============================== //

const WelcomeBanner = ({title, subTitle}) => {
  const theme = useTheme();

  return (
    <MainCard
      border={false}
      sx={{
        background:
          theme.direction === 'rtl'
          ? `linear-gradient(60.38deg, ${theme.palette.primary.main} 114%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.dark} 104.37%)`
          : `linear-gradient(250.38deg, ${theme.palette.primary.main} 2.39%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.dark} 104.37%)`
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
        <Grid item sm={6} xs={12} sx={{ display: { xs: 'none', sm: 'initial' } }}>
          <Stack justifyContent="center" alignItems="flex-end">
            <img src={WelcomeImage} alt="Welcome" style={{ position: 'absolute', height: '100%', top: '0px', right: '0px'}} />
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default WelcomeBanner;
