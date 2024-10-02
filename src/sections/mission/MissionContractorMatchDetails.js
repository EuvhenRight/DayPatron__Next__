import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';
import { Dialog, DialogTitle, DialogContent, Divider, IconButton } from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';

import {
  Button,
  Stack,
  Grid,
  Typography,
} from '@mui/material';

import SanitizedHTML from 'react-sanitized-html';
import MissionContractorMatchEmployerNotes from 'sections/mission/MissionContractorMatchEmployerNotes';
import MissionContractorMatchAdminNotes from 'sections/mission/MissionContractorMatchAdminNotes';
import { FileOutlined, CheckOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';

const MissionContractorMatchDetails = ({ missionContractorMatch, setMissionContractorMatch, missionId, contractorId, missionContractor, setMissionContractor }) => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const [isCreatingInvitation, setIsCreatingInvitation] = useState(false);
  const [isDeletingInvitation, setIsDeletingInvitation] = useState(false);
  const [isCreatingApproval, setIsCreatingApproval] = useState(false);
  const [isDeletingApproval, setIsDeletingApproval] = useState(false);
  const [isTogglingMatch, setIsTogglingMatch] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const handleInviteButtonClick = async () => {
    try {
      setIsCreatingInvitation(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/invitations',
        { method: 'POST', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed inviting match.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsCreatingInvitation(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully invited match.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsCreatingInvitation(false);

      let json = await response.json();
      var newMissionContractorMatch = { ...missionContractorMatch };
      newMissionContractorMatch.invitation = json;

      setMissionContractorMatch(newMissionContractorMatch);
    } catch (error) {
      setIsCreatingInvitation(false);
      console.log(error);
    }
  }

  const handleUninviteButtonClick = async () => {
    try {
      setIsDeletingInvitation(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/invitations',
        { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed uninviting match.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsDeletingInvitation(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully uninvited match.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsDeletingInvitation(false);

      var newMissionContractorMatch = { ...missionContractorMatch };
      newMissionContractorMatch.invitation = null;

      setMissionContractorMatch(newMissionContractorMatch);
    } catch (error) {
      setIsDeletingInvitation(false);
      console.log(error);
    }
  }

  const handleApproveButtonClick = async () => {
    try {
      setIsCreatingApproval(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/approvals',
        { method: 'POST', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed approving match.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsCreatingApproval(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully approved match.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsCreatingApproval(false);

      let json = await response.json();
      var newMissionContractorMatch = { ...missionContractorMatch };
      newMissionContractorMatch.approval = json;

      setMissionContractorMatch(newMissionContractorMatch);
    } catch (error) {
      setIsCreatingApproval(false);
      console.log(error);
    }
  }

  const handleToggleMatchButtonClick = async () => {
    setIsTogglingMatch(true);
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/matches/' + encodeURIComponent(contractorId),
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({isMatch: !missionContractorMatch?.isMatch})
      }
    );

    if (!response.ok) {
      dispatch(openSnackbar({ open: true, message: 'Toggling match failed.', variant: 'alert', alert: { color: 'error' }, close: false }));
      setIsTogglingMatch(false);
      return;
    }

    dispatch(openSnackbar({ open: true, message: 'Match toggled.', variant: 'alert', alert: { color: 'success' }, close: false }));
    setIsTogglingMatch(false);

    let json = await response.json();
    var newMissionContractorMatch = { ...missionContractorMatch };
    newMissionContractorMatch.isMatch = json?.missionContractorMatch?.isMatch;

    setMissionContractorMatch(newMissionContractorMatch);
  };

  const handleUnapproveButtonClick = async () => {
    try {
      setIsDeletingApproval(true);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/approvals',
        { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + keycloak.idToken } }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed unapproving match.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setIsDeletingApproval(false);
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Successfully unapproved match.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setIsDeletingApproval(false);

      var newMissionContractorMatch = { ...missionContractorMatch };
      newMissionContractorMatch.approval = null;

      setMissionContractorMatch(newMissionContractorMatch);
    } catch (error) {
      setIsDeletingApproval(false);
      console.log(error);
    }
  }

  const setEmployerNotes = (employerNotesParameter) => {
    var newMissionContractor = { ...missionContractor };
    newMissionContractor.employerNotes = employerNotesParameter;
    setMissionContractor(newMissionContractor);
  }

  const setAdminNotes = (adminNotesParameter) => {
    var newMissionContractor = { ...missionContractor };
    newMissionContractor.adminNotes = adminNotesParameter;
    setMissionContractor(newMissionContractor);
  }

  return (
    <>
      <Grid item sx={{mr: 1.5}}>
        <Button startIcon={<FileOutlined />} color="secondary" variant="contained" sx={{ width: '85px', height: '27px', marginBottom: 1.5}} onClick={() => {setIsNotesModalOpen(true)}}>
          Notes
        </Button>
      </Grid>
      <Grid item sx={{mr: 1.5}}>
        <Button 
          startIcon={missionContractorMatch?.invitation ? <CheckOutlined /> : <MinusOutlined />}
          color={missionContractorMatch?.invitation ? "success" : "error"}
          variant={missionContractorMatch?.invitation ? "contained" : "outlined"}
          disabled={isDeletingInvitation || isCreatingInvitation} 
          sx={{ width: '90px', height: '27px', marginBottom: 1.5}}
          onClick={() => {
            if(missionContractorMatch?.invitation) {
              handleUninviteButtonClick();
            } else {
              handleInviteButtonClick();
            }
          }}
        >
          {missionContractorMatch?.invitation ? "Invited" : "Invite"}
        </Button>
      </Grid>
      <Grid item sx={{mr: 1.5}}>
        <Button 
          startIcon={missionContractorMatch?.approval ? <CheckOutlined /> : <MinusOutlined />}
          color={missionContractorMatch?.approval ? "success" : "error"}
          variant={missionContractorMatch?.approval ? "contained" : "outlined"}
          disabled={isDeletingApproval || isCreatingApproval} 
          sx={{ width: '110px', height: '27px', marginBottom: 1.5}}
          onClick={() => {
            if(missionContractorMatch?.approval) {
              handleUnapproveButtonClick();
            } else {
              handleApproveButtonClick();
            }
          }}
        >
          {missionContractorMatch?.approval ? "Approved" : "Approve"}
        </Button>
      </Grid>
      <Grid item sx={{mr: 1.5}}>
        {keycloak.tokenParsed.roles.includes('admin') &&
          <Button 
            startIcon={missionContractorMatch?.isMatch ? <CheckOutlined /> : <MinusOutlined />}
            color={missionContractorMatch?.isMatch ? "success" : "error"}
            variant={missionContractorMatch?.isMatch ? "contained" : "outlined"}
            disabled={isTogglingMatch} 
            sx={{ width: '100px', height: '27px', marginBottom: 1.5}}
            onClick={() => {
              handleToggleMatchButtonClick();
            }}
          >
            {missionContractorMatch?.isMatch ? "Matched" : "Match"}
          </Button>
        }
      </Grid>
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={() => {setIsNotesModalOpen(false)}}
        open={isNotesModalOpen}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
        >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Notes</Typography>
          <IconButton sx={{ ml: 'auto' }} onClick={() => {setIsNotesModalOpen(false)}}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MissionContractorMatchEmployerNotes
                missionId={missionId}
                contractorId={contractorId}
                employerNotes={missionContractor?.employerNotes}
                setEmployerNotes={setEmployerNotes}>
              </MissionContractorMatchEmployerNotes>
            </Grid>

            {missionContractor?.contractorNotes?.showContractorNotesToEmployer &&
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Talent Notes</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Talent Notes About the Mission</Typography>
                      <SanitizedHTML html={missionContractor?.contractorNotes?.missionNotes} />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            }

            <Grid item xs={12}>
              <MissionContractorMatchAdminNotes
                missionId={missionId}
                contractorId={contractorId}
                adminNotes={missionContractor?.adminNotes}
                setAdminNotes={setAdminNotes}>
              </MissionContractorMatchAdminNotes>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionContractorMatchDetails;
