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
          We&apos;re here to enhance your journey with helpful support videos that cover everything you need to know. From start to finish, we&apos;ve got you covered. And if you ever need a hand and cannot find the information you are looking for, just click the “Support“ button on the bottom left.
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to contact us for Support">
              <Stack spacing={2}>
                <Typography color="secondary">
                 How do I reach out to 10x if I cannot find what I&apos;m are looking for here in the Support Video Hub? 
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/embed/c272576ad1ce4c6286d6dcf80ecdbc68?sid=71623775-5405-4f09-970e-b798e1b29617%22"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to contact us for Support">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is a short description about the video
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/embed/c272576ad1ce4c6286d6dcf80ecdbc68?sid=71623775-5405-4f09-970e-b798e1b29617%22"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

        </Grid>
      </Grid >
    </Grid >
  );
};

export default SupportPage;
