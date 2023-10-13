// material-ui
import {
  AvatarGroup,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import { CheckOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// third-party
import { format } from 'date-fns';


// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| TRANSACTION HISTORY ||============================== //

function PayoutHistory({ payoutHistoryData }) {
  const loomRecordButtonId = "loom-record-sdk-button";
  const handleNeedHelpClick = () => { document.getElementById(loomRecordButtonId).click(); }
  return (
    <>
      {payoutHistoryData && <>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Payout History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              p: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            {payoutHistoryData?.map((row, rowIndex) => (
              <ListItemButton key={rowIndex} divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'success.main',
                      bgcolor: 'success.lighter'
                    }}
                  >
                    <CheckOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">{row?.debtorName}</Typography>} secondary={format(new Date(row?.invoiceDate), "dd-MM-yyyy")} />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      {(row?.totalAmount * -1).toFixed(2).replace('.', ',')}
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </MainCard>
      </>}

      <MainCard sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Stack>
                <Typography variant="h4" noWrap>
                  Help & Support
                </Typography>
              </Stack>
            </Grid>
            <Grid item>
              <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                <Avatar alt="Remy Sharp" src={avatar1} />
                <Avatar alt="Travis Howard" src={avatar2} />
                <Avatar alt="Cindy Baker" src={avatar3} />
                <Avatar alt="Agnes Walker" src={avatar4} />
              </AvatarGroup>
            </Grid>
          </Grid>
          <Typography variant="subtitle">
            Hit the button and record your video with your question. One of our community managers will get back to you as soon as possible.
          </Typography>
          <Button size="small" onClick={handleNeedHelpClick} variant="contained" sx={{ textTransform: 'capitalize', maxWidth: 'max-content', px: 2.25, py: 0.75 }}>
            Need Help?
          </Button>
        </Stack>
      </MainCard>
    </>
  );
}

export default PayoutHistory;
