import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import {
  Link,
  Checkbox,
  FormControlLabel,
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

const EmployerSubscriptionServiceOrderPage = () => {
  let { orderId, role } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [hasAcceptedProjectOrderTerms, setHasAcceptedProjectOrderTerms] = useState(null);

  if(role === 'company')
    role = 'employer';

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
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + order.id + '/employer-service-orders/' + role + '-approvals',
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
  
  const handleProjectOrderTermsClick = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/project-order-terms',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let file = await response.blob();
      var fileUrl = URL.createObjectURL(file);

      if (fileUrl)
        setTimeout(function () {
          URL.revokeObjectURL(fileUrl);
        }, 300000);

      window.open(fileUrl, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  const getIsServiceOrderApprovable = (orderArg, subOrderType, roleArg) => {
    if (roleArg !== 'admin' && !hasAcceptedProjectOrderTerms) {
      return false;
    }

    if (subOrderType === 'employer-service-order') {
      if(roleArg === 'admin')
        return orderArg?.employerServiceOrder?.adminStatus === 'Pending';
      else if (roleArg === 'employer')
        return orderArg?.employerServiceOrder?.employerStatus === 'Pending';
    }

    return false;
  };

  const getServiceOrderContent = (orderArg, subOrderType, roleArg) => {
    if (!orderArg)
      return;

    if (subOrderType === 'employer-service-order') {
        return <>
            <Grid item xs={12}>
                <Typography>ID: {orderArg?.employerServiceOrder?.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <MainCard>
                    <Stack>
                    <Typography>{orderArg?.employerLegalEntityName}</Typography>
                    <Typography>{orderArg?.employerLegalEntityRepresentativeName}</Typography>
                    <Typography>{orderArg?.employerStreet} {orderArg?.employerStreetNumber}</Typography>
                    <Typography>{orderArg?.employerPostCode} {orderArg?.employerCity}</Typography>
                    <Typography>{countries.find(x => x.code === orderArg?.employerCountry)?.label}</Typography>
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6}>
            <MainCard>
                <Stack>
                <Typography>{orderArg?.adminLegalEntityName}</Typography>
                <Typography>{orderArg?.adminLegalEntityRepresentativeName}</Typography>
                <Typography>{orderArg?.adminStreet} {orderArg?.adminStreetNumber}</Typography>
                <Typography>{orderArg?.adminPostCode} {orderArg?.adminCity}</Typography>
                <Typography>{countries.find(x => x.code === orderArg?.adminCountry)?.label}</Typography>
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
                        &euro;{orderArg?.employerServiceOrder?.rateAmount}
                        </ListItemSecondaryAction>
                    </ListItem>
                    </List>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Purchase Terms</Typography>
                <SanitizedHTML html={orderArg?.employerServiceOrder?.description} />
            </Grid>
            {keycloak.tokenParsed.roles.includes('employer') && roleArg === 'employer' &&
                <Grid item xs={12}>
                    <FormControlLabel
                    control={<Checkbox checked={hasAcceptedProjectOrderTerms} onChange={(event) => setHasAcceptedProjectOrderTerms(event.target.checked)} color="primary" />}
                    label={<p>I have read and agree to the <Link href="#" onClick={handleProjectOrderTermsClick}>Project Contract Terms &amp; Conditions</Link> that are applicable to this Service Order.</p>}
                    />
                </Grid>
            }
        </>
    }
  };

  return (
    <MainCard title="Company Subscription Service Order">
      <Grid container spacing={2}>
          {getServiceOrderContent(order, 'employer-service-order', role)}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={() => {
                navigate('/orders');
              }}
                color="secondary"
                variant="outlined">
                Cancel
              </Button>
              <Button disabled={!getIsServiceOrderApprovable(order, 'employer-service-order', role)} fullWidth color="primary" variant="contained" onClick={handleApproveConfirmClick} autoFocus>
                Approve
              </Button>
            </Stack>
          </Grid>
        </Grid>
    </MainCard>
  );
};

export default EmployerSubscriptionServiceOrderPage;