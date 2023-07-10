import {
  Typography,
  Stack,
  Grid
} from '@mui/material';
import SanitizedHTML from 'react-sanitized-html';

const MissionContractorMatchAdminDetailsView = ({ adminDetails }) => {
  return (

    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3">Admin Notes</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <Typography color="secondary">Contractor Notes</Typography>
          {adminDetails?.showContractorNotesToEmployer &&
            <SanitizedHTML html={adminDetails?.contractorNotes} />
          }
          {!adminDetails?.showMissionNotesToEmployer &&
            <Typography>No data available.</Typography>
          }
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={0.5}>
          <Typography color="secondary">Mission Notes</Typography>
          {adminDetails?.showMissionNotesToEmployer &&
            <SanitizedHTML html={adminDetails?.missionNotes} />
          }
          {!adminDetails?.showMissionNotesToEmployer &&
            <Typography>No data available.</Typography>
          }
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MissionContractorMatchAdminDetailsView;
