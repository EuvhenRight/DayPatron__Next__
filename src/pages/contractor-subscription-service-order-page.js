import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import {
  Grid,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';

import { useParams } from 'react-router-dom';
import SanitizedHTML from 'react-sanitized-html';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { openSnackbar } from 'store/reducers/snackbar';
import countries from 'data/countries';

const ContractorSubscriptionServiceOrderPage = () => {
  let { orderId } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      await bindOrder();
    })();
  }, [orderId, keycloak?.idToken]);

  const bindOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + orderId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setOrder(json.order);
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleApproveConfirmClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + order.id + '/contractor-service-orders/admin-approvals',
      {
        method: 'PUT',
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
          message: 'Failed approving.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );

      return;
    }

    dispatch(
      openSnackbar({
        open: true,
        message: "Approved.",
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );

    navigate('/orders');
  };

  const getIsServiceOrderApprovable = (orderArg, subOrderType, role) => {
    if (subOrderType === 'contractor-service-order') {
      if (role === 'admin')
        return orderArg?.contractorServiceOrder?.adminStatus === 'Pending';
    }

    return false;
  };

  const getServiceOrderContent = (orderArg, subOrderType) => {
    if (!orderArg)
      return;

    if (subOrderType === 'contractor-service-order') {
        return <>
            <Grid item xs={12}>
                <Typography>ID: {orderArg?.contractorServiceOrder?.id}</Typography>
            </Grid>
            <Grid item xs={6}>
            <MainCard>
                <Stack>
                <Typography>{orderArg?.contractorLegalEntityName}</Typography>
                <Typography>{orderArg?.contractorLegalEntityRepresentativeName}</Typography>
                <Typography>{orderArg?.contractorStreet} {orderArg?.contractorStreetNumber}</Typography>
                <Typography>{orderArg?.contractorPostCode} {orderArg?.contractorCity}</Typography>
                <Typography>{countries.find(x => x.code === orderArg?.contractorCountry)?.label}</Typography>
                <Typography>&nbsp;</Typography>
                <Typography>VAT#: {orderArg?.contractorVatNumber}</Typography>
                <Typography>CoC#: {orderArg?.contractorChamberOfCommerceIdentifier}</Typography>
                </Stack>
            </MainCard>
            </Grid>
            <Grid item xs={6}>
            <MainCard>
                <Stack>
                <Typography>{orderArg?.adminLegalEntityName}</Typography>
                <Typography>{orderArg?.adminLegalEntityRepresentativeName}</Typography>
                <Typography>{orderArg?.adminStreet} {orderArg?.adminStreetNumber}</Typography>
                <Typography>{orderArg?.adminPostCode} {orderArg?.adminCity}</Typography>
                <Typography>{countries.find(x => x.code === orderArg?.adminCountry)?.label}</Typography>
                <Typography>&nbsp;</Typography>
                <Typography>VAT#: {orderArg?.adminVatNumber}</Typography>
                <Typography>CoC#: {orderArg?.adminChamberOfCommerceIdentifier}</Typography>
                </Stack>
            </MainCard>
            </Grid>
            <Grid item xs={12}>
            <MainCard>
                <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                <ListItem>
                    <ListItemText>
                    10x-er
                    </ListItemText>
                    <ListItemSecondaryAction>
                    {orderArg?.contractorName}
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>
                    Subscription
                    </ListItemText>
                    <ListItemSecondaryAction>
                    {orderArg?.subscriptionPlanTitle}
                    </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                    <ListItemText>
                    <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                    &euro;{orderArg?.contractorServiceOrder?.rateAmount}
                    </ListItemSecondaryAction>
                </ListItem>
                </List>
            </MainCard>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Purchase Terms</Typography>
                <SanitizedHTML html={orderArg?.contractorServiceOrder?.description} />
            </Grid>
        </>;
    }
  };

  if(!keycloak.tokenParsed.roles.includes('admin'))
    return;

  return (
    <MainCard title="Talent Subscription Service Order">
      <Grid container spacing={2}>
          {getServiceOrderContent(order, 'contractor-service-order')}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={() => {
                navigate('/orders');
              }}
                color="secondary"
                variant="outlined">
                Cancel
              </Button>
              <Button disabled={!getIsServiceOrderApprovable(order, 'contractor-service-order', 'admin')} fullWidth color="primary" variant="contained" onClick={handleApproveConfirmClick} autoFocus>
                Approve
              </Button>
            </Stack>
          </Grid>
        </Grid>
    </MainCard>
  );
};

export default ContractorSubscriptionServiceOrderPage;