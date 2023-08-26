import PropTypes from 'prop-types';

import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { useKeycloak } from '@react-keycloak/web';

// ==============================|| ORDER - CARD ||============================== //

const OrderCard = ({ order }) => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <ShoppingCartOutlined style={{ color: theme.palette.primary.main, fontSize: '2.5rem' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Buy &apos;{order?.productTitle}&apos;</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Solution by &apos;{order?.contractorName}&apos;
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack direction="column" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Company Service Order
                </Typography>
                <Divider />

                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      Admin Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {keycloak.tokenParsed.roles.includes('admin') ?
                        (<Button variant="contained" align="right">Approve</Button>):
                        (<Typography align="right">{order?.employerServiceOrder?.adminStatus}</Typography>)
                      }
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      Company Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography align="right">{order?.employerServiceOrder?.employerStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      Price
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography align="right">&euro;{order?.employerServiceOrder?.rateAmount}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      Implementation Hours
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography align="right">{order?.employerServiceOrder?.durationHours}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Talent Service Order
                </Typography>
                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      Admin Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography align="right">{order?.contractorServiceOrder?.adminStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      Employer Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography align="right">{order?.contractorServiceOrder?.contractorStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object
};

export default OrderCard;
