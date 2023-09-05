import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

// material-ui
import {
  Grid,
  Typography,
  CardMedia,
  Stack
} from '@mui/material';

const SupportPage = () => {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <WelcomeBanner title="10x Support Hub" subTitle=" Welcome to the 10x Support Hub - your pathway to success made simple." />
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          We&apos;re here to enhance your journey with helpful support videos that cover everything you need to know. From start to finish, we&apos;ve got you covered.
          And if you ever need a hand, just click the &ldquo;Need Help&ldquo; button on the bottom left. It&apos;s your direct line to our experts, available in Chrome or with the Loom desktop app. Your journey matters, and we&apos;re here to make it a smooth and successful one.
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>

            <MainCard title="How to ...">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is a short description about the video
                </Typography>
                <CardMedia
                  sx={{minHeight: 300}}
                  component="iframe"
                  src="https://www.loom.com/embed/956f668668f84e179cf3395f77322956?sid=71623775-5405-4f09-970e-b798e1b29617%22"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>

          </Grid>
        </Grid>
      </Grid >
    </Grid >
  );
};

export default SupportPage;