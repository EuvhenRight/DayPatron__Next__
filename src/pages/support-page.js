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
                  This is how you can contact us for support.
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

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to update your user profile">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is how you can update your user profile.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/537580c852334db1b6e205412610e532?sid=6352dd69-a5e4-4046-a397-801dc1119328"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to update your company details">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is how you can update your company details.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/788c34f98cbe4f0d8ed71d20761075b1?sid=ccba48e6-1bb2-46c9-b9d4-cba727c24559"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How the 10x matching algorithm works">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is you can get talent matches to your missions.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/6b6876b7c0614ee7a44cf5338b42be86?sid=da28f4e7-1b1b-45f1-95a5-68d6e5ee307c"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to enter notes for a talent mission match">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is how you can maintain notes about a talent missions match.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/7bba154341cc484e8432b6e6b47fdd9f?sid=db91abc8-efe6-4e0b-9b53-090c0d3cea86"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to schedule a meeting with a talent">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is how you can schedule a meeting with a talent.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/2dfd04cf72c74c3b824612183a748599?sid=3afa25b9-2add-419c-bb63-e6bf597325d3"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How 10x contracting works">
              <Stack spacing={2}>
                <Typography color="secondary">
                  This is how you can see and approve contracts between your company and 10x and between your company and the talent.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/5efa8687b5d1417ca2ca1ed4e1352b5f?sid=cd851fb0-a414-4de4-ac08-2ca7e3ae2a11"
                  allowFullScreen={true} />
              </Stack>
            </MainCard>
          </Grid>
          {/* ---------------- END COPY ---------------- */}

          {/* ---------------- START COPY ---------------- */}
          <Grid item xs={12} md={4}>
            <MainCard title="How to view AI profile of 10x-er">
              <Stack spacing={2}>
                <Typography color="secondary">
                  At 10x we screen candidates and one of our methods is to use a dynamic digital AI model which is completely bias free.
                </Typography>
                <CardMedia
                  sx={{ minHeight: 300, border: 0 }}
                  component="iframe"
                  src="https://www.loom.com/embed/50fc7c8c52e547c88b17c1054d069bf6?sid=40d214a2-b91e-4c96-b65f-1d3245c63bf3"
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