import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

// ==============================|| EMPLOYER - DELETE ||============================== //

export default function AlertEmployerDelete({ employer, open, handleClose, onArchive }) {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();

  const handleArchive = async () => {

    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + employer.id,
      {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Archiving failed.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      handleClose(false);
      return;
    }

    onArchive;

    dispatch(
      openSnackbar({
        open: true,
        message: 'Employer archived.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );

    handleClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to archive employer{' '}
              &quot;{employer?.name}&quot;{' '}?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleArchive()} autoFocus>
              Archive
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertEmployerDelete.propTypes = {
  employer: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onArchive: PropTypes.func
};
