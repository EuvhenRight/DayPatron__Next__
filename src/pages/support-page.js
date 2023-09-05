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
            <MainCard title="How to contact us for Support">
              <Stack spacing={2}>
                <Typography color="secondary">
                 How can I add my personal information and start building my profile?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/share/a7149c81d9b94bf6b774dfdba69e9c23?sid=35680400-79d1-41c7-8a57-8a494a260069"
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
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/share/a7149c81d9b94bf6b774dfdba69e9c23?sid=35680400-79d1-41c7-8a57-8a494a260069"
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
                  How can I add my personal information and start building my profile?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/share/b1d163b872b543e186c1acc5b17ab35a?sid=5a0cc5a0-9f32-4801-8c85-0ca86345bde7"
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
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/share/809fe230fcb243b08c77afc8f83dc858?sid=518e8074-31f1-4a20-808d-643d43bb6e1b"
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
                  How can I set my availability and make adjustments to my availability?
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300 }}
                  component="iframe"
                  src="https://www.loom.com/share/c8e06d94f9654d978621df15ffc7d3f7?sid=08a81bf4-d725-4ae1-a87e-44905785a9cb"
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
