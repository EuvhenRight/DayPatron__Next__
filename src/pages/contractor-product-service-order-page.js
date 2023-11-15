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

const ContractorProductServiceOrderPage = () => {
  let { orderId } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [hasAcceptedProjectOrderTerms, setHasAcceptedProjectOrderTerms] = useState(null);

  useEffect(() => {
    (async () => {
      await bindOrder();
    })();
  }, [orderId, keycloak?.idToken]);

  const bindOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/' + orderId,
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
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/' + order.id + '/contractor-service-orders/contractor-approvals',
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
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/project-order-terms',
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

  const getIsServiceOrderApprovable = (orderParam, subOrderType, role) => {
    if (!hasAcceptedProjectOrderTerms) {
      return false;
    }

    if (subOrderType === 'contractor-service-order') {
      if (role === 'contractor')
        return orderParam?.contractorServiceOrder?.contractorStatus === 'Pending';
    }

    return false;
  };

  const getServiceOrderContent = (orderParam, subOrderType, role) => {
    if (!orderParam)
      return;

    if (subOrderType === 'contractor-service-order') {
      return <>
        <Grid item xs={12}>
          <Typography>ID: {orderParam?.contractorServiceOrder?.id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <MainCard>
            <Stack>
              <Typography>{orderParam?.contractorLegalEntityName}</Typography>
              <Typography>{orderParam?.contractorLegalEntityRepresentativeName}</Typography>
              <Typography>{orderParam?.contractorStreet} {orderParam?.contractorStreetNumber}</Typography>
              <Typography>{orderParam?.contractorPostCode} {orderParam?.contractorCity}</Typography>
              <Typography>{countries.find(x => x.code === orderParam?.contractorCountry)?.label}</Typography>
              <Typography>&nbsp;</Typography>
              <Typography>VAT#: {orderParam?.contractorVatNumber}</Typography>
              <Typography>CoC#: {orderParam?.contractorChamberOfCommerceIdentifier}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={6}>
          <MainCard>
            <Stack>
              <Typography>{orderParam?.adminLegalEntityName}</Typography>
              <Typography>{orderParam?.adminLegalEntityRepresentativeName}</Typography>
              <Typography>{orderParam?.adminStreet} {orderParam?.adminStreetNumber}</Typography>
              <Typography>{orderParam?.adminPostCode} {orderParam?.adminCity}</Typography>
              <Typography>{countries.find(x => x.code === orderParam?.adminCountry)?.label}</Typography>
              <Typography>&nbsp;</Typography>
              <Typography>VAT#: {orderParam?.adminVatNumber}</Typography>
              <Typography>CoC#: {orderParam?.adminChamberOfCommerceIdentifier}</Typography>
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
                  {orderParam?.contractorName}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Solution
                </ListItemText>
                <ListItemSecondaryAction>
                  {orderParam?.productTitle}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  &euro;{orderParam?.contractorServiceOrder?.rateAmount}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Purchase Terms</Typography>
          <SanitizedHTML html={orderParam?.contractorServiceOrder?.description} />
        </Grid>
        {keycloak.tokenParsed.roles.includes('contractor') && role === 'contractor' &&
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={hasAcceptedProjectOrderTerms} onChange={(event) => setHasAcceptedProjectOrderTerms(event.target.checked)} color="primary" />}
              label={<p>I have read and agree to the <Link href="#" onClick={handleProjectOrderTermsClick}>Project Contract Terms &amp; Conditions</Link> that are applicable to this Service Order.</p>}
            />
          </Grid>
        }
      </>;
    }
  };

  return (
    <MainCard title="Solution Service Order">
      <Grid container spacing={2}>
          {getServiceOrderContent(order, 'contractor-service-order', 'contractor')}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={() => {
                navigate('/orders');
              }}
                color="secondary"
                variant="outlined">
                Cancel
              </Button>
              <Button disabled={!getIsServiceOrderApprovable(order, 'contractor-service-order', 'contractor')} fullWidth color="primary" variant="contained" onClick={handleApproveConfirmClick} autoFocus>
                Approve
              </Button>
            </Stack>
          </Grid>
        </Grid>
    </MainCard>
  );
};

export default ContractorProductServiceOrderPage;