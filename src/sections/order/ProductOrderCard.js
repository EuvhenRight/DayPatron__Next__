import PropTypes from 'prop-types';

import {
  Link,
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

const ProductOrderCard = ({ order, handleApproveClick }) => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();

  const getStatusComponent = (approvalStatus, requiredRole, subOrderType) => {
    if (approvalStatus === 'Pending' && keycloak.tokenParsed.roles.includes(requiredRole)) {
      return <Stack direction="row" spacing={0.5}>
        <Typography>{approvalStatus}</Typography>
        <Stack direction="row">
          (<Link className="clickable" onClick={() => handleApproveClick(order, subOrderType)}>Approve</Link>)
        </Stack>
      </Stack>;
    }

    return <Typography>{approvalStatus}</Typography>;
  }

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
                  {keycloak.tokenParsed.roles.includes('admin') &&
                    <ListItem>
                      <ListItemText>
                        Admin Approval Status
                      </ListItemText>
                      <ListItemSecondaryAction>
                        {getStatusComponent(order?.employerServiceOrder?.adminStatus, 'admin', 'employer-service-order')}
                      </ListItemSecondaryAction>
                    </ListItem>
                  }
                  <ListItem>
                    <ListItemText>
                      Company Approval Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.employerServiceOrder?.employerStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      Amount
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>&euro;{order?.employerServiceOrder?.rateAmount}</Typography>
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
                  {keycloak.tokenParsed.roles.includes('admin') &&
                    <ListItem>
                      <ListItemText>
                        Admin Approval Status
                      </ListItemText>
                      <ListItemSecondaryAction>
                        {getStatusComponent(order?.contractorServiceOrder?.adminStatus, 'admin', 'contractor-service-order')}
                      </ListItemSecondaryAction>
                    </ListItem>
                  }
                  <ListItem>
                    <ListItemText>
                      Talent Approval Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.contractorServiceOrder?.contractorStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {keycloak.tokenParsed.roles.includes('admin') &&
                    <ListItem>
                      <ListItemText>
                        Amount
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <Typography>&euro;{order?.contractorServiceOrder?.rateAmount}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  }
                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Project Order
                </Typography>
                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>

                  <ListItem>
                    <ListItemText>
                      Company Approval Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.employerContractorProjectOrder?.employerStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      Talent Approval Status
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.employerContractorProjectOrder?.contractorStatus}</Typography>
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

ProductOrderCard.propTypes = {
  order: PropTypes.object,
  handleApproveClick: PropTypes.func
};

export default ProductOrderCard;
