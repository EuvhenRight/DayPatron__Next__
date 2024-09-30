import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { openSnackbar } from 'store/reducers/snackbar';
import { prepareApiBody } from 'utils/stringUtils';

import {
  Button,
  Chip,
  ListItem,
  Stack,
  Box,
  Grid,
  Typography,
  List, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';

import SanitizedHTML from 'react-sanitized-html';
import MissionContractorMatchEmployerNotes from 'sections/mission/MissionContractorMatchEmployerNotes';
import MissionContractorMatchAdminNotes from 'sections/mission/MissionContractorMatchAdminNotes';
import { DownOutlined, FileOutlined, SwapOutlined, UpOutlined } from '@ant-design/icons';

const MissionContractorMatchDetails = ({ missionContractorMatch, setMissionContractorMatch, missionId, contractorId, missionContractor, setMissionContractor }) => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const [isCreatingInvitation, setIsCreatingInvitation] = useState(false);
  const [isDeletingInvitation, setIsDeletingInvitation] = useState(false);
  const [isCreatingApproval, setIsCreatingApproval] = useState(false);
  const [isDeletingApproval, setIsDeletingApproval] = useState(false);
  const [isTogglingMatch, setIsTogglingMatch] = useState(false);
  const [isExpandNotes, setIsExpandNotes] = useState(false);

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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack alignItems="center">
          <Typography variant="h4">{missionContractorMatch?.contractor?.firstName + " " + missionContractorMatch?.contractor?.lastName}</Typography>
          <SwapOutlined />
          <Typography variant="h4">{missionContractorMatch?.mission?.title}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack alignItems="center">

          <Stack spacing={0.5} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0
              }}
              component="ul"
            >
              {missionContractorMatch?.isMatch &&
                <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                  <Chip color="primary" size="small" label="Matched" />
                </ListItem>
              }
              {missionContractorMatch?.invitation &&
                <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                  <Chip color="primary" size="small" label="Invited" />
                </ListItem>
              }
              {missionContractorMatch?.application &&
                <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                  <Chip color="primary" size="small" label="Applied" />
                </ListItem>
              }
              {missionContractorMatch?.approval &&
                <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                  <Chip color="success" size="small" label="Approved" />
                </ListItem>
              }
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            {missionContractorMatch?.invitation ?
              (
                <Button variant="outlined" onClick={handleUninviteButtonClick} disabled={isDeletingInvitation}>
                  Uninvite
                </Button>
              )
              :
              (
                <Button variant="contained" onClick={handleInviteButtonClick} disabled={isCreatingInvitation}>
                  Invite
                </Button>
              )
            }

            {missionContractorMatch?.approval ?
              (
                <Button color="success" variant="outlined" onClick={handleUnapproveButtonClick} disabled={isDeletingApproval}>
                  Unapprove
                </Button>
              )
              :
              (
                <Button color="success" variant="contained" onClick={handleApproveButtonClick} disabled={isCreatingApproval}>
                  Approve
                </Button>
              )
            }

            {keycloak.tokenParsed.roles.includes('admin') &&
              <Button color="primary" variant="outlined" onClick={handleToggleMatchButtonClick} disabled={isTogglingMatch}>
                {missionContractorMatch?.isMatch ? "Unmatch" : "Match"}
              </Button>
            }
          </Stack>

        </Stack>
      </Grid>
      <Grid item xs={12}>
        <List>
          <ListItemButton onClick={() => {setIsExpandNotes(!isExpandNotes);}}>
            <ListItemIcon>
              <FileOutlined />
            </ListItemIcon>
            <ListItemText primary="Notes" />
            {isExpandNotes ? <UpOutlined /> : <DownOutlined />}
          </ListItemButton>
        </List>
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isExpandNotes} timeout="auto" unmountOnExit>
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
        </Collapse>
      </Grid>
      
    </Grid>
  );
};

export default MissionContractorMatchDetails;
