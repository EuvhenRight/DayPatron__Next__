import {
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  Stack,
  Grid
} from '@mui/material';
import SanitizedHTML from 'react-sanitized-html';

const MissionContractorMatchAdminDetailsView = ({ adminDetails }) => {
  console.log(adminDetails);
  return (
    <>
      <DialogTitle>Admin Settings</DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 2.5 }}>

        <Grid container spacing={3}>
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
      </DialogContent>
    </>
  );
};

export default MissionContractorMatchAdminDetailsView;
