import {
  DialogContent,
  DialogTitle,
  Divider,
  Typography
} from '@mui/material';
import SanitizedHTML from 'react-sanitized-html';

const MissionContractorMatchAdminDetailsView = ({ adminDetails }) => {
  console.log(adminDetails);
  return (
    <>
      <DialogTitle>Admin Details</DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 2.5 }}>
        <Typography variant="h5">Contractor Notes</Typography>
        {adminDetails?.showContractorNotesToEmployer &&
          <SanitizedHTML html={adminDetails?.contractorNotes} />
        }
        {!adminDetails?.showMissionNotesToEmployer &&
          <Typography>No data available.</Typography>
        }

        <Typography variant="h5">Mission Notes</Typography>
        {adminDetails?.showMissionNotesToEmployer &&
          <SanitizedHTML html={adminDetails?.missionNotes} />
        }
        {!adminDetails?.showMissionNotesToEmployer &&
          <Typography>No data available.</Typography>
        }
      </DialogContent>
    </>
  );
};

export default MissionContractorMatchAdminDetailsView;
