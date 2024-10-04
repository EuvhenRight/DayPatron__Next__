import {
  Typography,
  Stack,
  Grid
} from '@mui/material';
import SanitizedHTML from 'react-sanitized-html';

const MissionContractorMatchAdminNotesView = ({ adminNotes }) => {
  return (

    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Admin Notes</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <Typography color="secondary">Talent Notes</Typography>
          {adminNotes?.showContractorNotesToEmployer &&
            <SanitizedHTML html={adminNotes?.contractorNotes} />
          }
          {!adminNotes?.showMissionNotesToEmployer &&
            <Typography>No data available.</Typography>
          }
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <Typography color="secondary">Mission Notes</Typography>
          {adminNotes?.showMissionNotesToEmployer &&
            <SanitizedHTML html={adminNotes?.missionNotes} />
          }
          {!adminNotes?.showMissionNotesToEmployer &&
            <Typography>No data available.</Typography>
          }
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MissionContractorMatchAdminNotesView;
