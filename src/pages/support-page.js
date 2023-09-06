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
          We&apos;re here to enhance your journey with helpful support videos that cover everything you need to know. From start to finish, we&apos;ve got you covered. And if you ever need a hand and cannot find the information you are looking for, just click the &quot;Support&quot; button on the bottom left.
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>

{/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to understand your Dashboard">
              <Stack spacing={2}>
                <Typography color="secondary">
                 What information is shown and not shown on my dashboard?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/74cf81b9d6264a9a940fbd0a01cddc97?sid=ea5ab5da-fc55-44be-bb52-1d55825ca194"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}
  
{/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to Change Email Address">
              <Stack spacing={2}>
                <Typography color="secondary">
                 How can I adjust my email address and login account?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/fc369ee251d844d3ba2f55db87c66768?sid=88e5c800-2bc1-46fb-b4d3-9c0e3d4a873b"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to add personal information">
              <Stack spacing={2}>
                <Typography color="secondary">
                  How can I add my personal information and start building my profile?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/a7149c81d9b94bf6b774dfdba69e9c23?sid=de63d441-baf7-40e0-bcbb-2bbba5d4bd20"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

 {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to set your personal preferences">
              <Stack spacing={2}>
                <Typography color="secondary">
                  How can I set my currency, rates, work location and travel distance?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/b1d163b872b543e186c1acc5b17ab35a?sid=906a55a3-f917-439d-8630-fa6d416e273c"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

{/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to Find a Mission">
              <Stack spacing={2}>
                <Typography color="secondary">
                  How can I find missions and filter missions, but also see the difference between matched, invited and applied?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/809fe230fcb243b08c77afc8f83dc858?sid=7a5fd349-cc2a-473d-bcaa-b3c636f36f1d"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

{/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to Set Availability">
              <Stack spacing={2}>
                <Typography color="secondary">
                  How can I set my availability, allocate specific days to 10x availability or make adjustments to my availability?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/c8e06d94f9654d978621df15ffc7d3f7?sid=03e25d79-d747-4650-b87a-558e74412e45"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

{/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to add a Solution">
              <Stack spacing={2}>
                <Typography color="secondary">
                  How can I add a Solution to the Solution Suite of 10x?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/1db3e3393a2c45378fb3b2109de126de?sid=ae4d2398-d331-4ad5-b86c-a81842f33837"
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
                 How do I reach out to 10x if I cannot find what I&apos;m are looking for here in the Support Video Hub? 
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
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
