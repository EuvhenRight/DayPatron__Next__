import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Pagination,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';

import { openSnackbar } from 'store/reducers/snackbar';
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import ProductOrderCard from 'sections/order/ProductOrderCard';
import { PopupTransition } from 'components/@extended/Transitions';
import SanitizedHTML from 'react-sanitized-html';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';

// ==============================|| ORDERS - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'ProductTitle'
  },
  {
    id: 3,
    header: 'ContractorName'
  }
];

const ProductOrders = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);

  const [openServiceOrderDialog, setOpenServiceOrderDialog] = useState(false);
  const [orderToView, setOrderToView] = useState(null);
  const [subOrderTypeToView, setSubOrderTypeToView] = useState(null);

  const bindOrders = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders?employerUserId=' + encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setOrders(json.orders);
      setFilteredOrders(json.orders);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindOrders();
    })();
  }, []);

  useEffect(() => {
    const newOrders = orders.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredOrders(newOrders);
  }, [globalFilter]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredOrders.length / PER_PAGE);
  const _DATA = usePagination(filteredOrders, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleApproveConfirmClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/' + orderToView.id + '/' + subOrderTypeToView + 's/admin-approvals',
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

      setOpenServiceOrderDialog(false);
      setOrderToView(null);
      setSubOrderTypeToView(null);
      return;
    }

    setOpenServiceOrderDialog(false);
    setOrderToView(null);
    setSubOrderTypeToView(null);

    bindOrders();

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
  };

  const handleApproveClick = (order, subOrderType) => {
    setOpenServiceOrderDialog(true);
    setOrderToView(order);
    setSubOrderTypeToView(subOrderType);
  };
  
  const getIsServiceOrderApprovable = (order, subOrderType) => {
    if (!keycloak.tokenParsed.roles.includes('admin')) {
      return false;
    }

    if (subOrderType === 'employer-service-order') {
      return order?.employerServiceOrder?.adminStatus === 'Pending';
    } else if (subOrderType === 'contractor-service-order') {
      return order?.contractorServiceOrder?.adminStatus === 'Pending';
    }

    return false;
  };

  const getServiceOrderContent = (order, subOrderType) => {
    if (!order)
      return;

    if (subOrderType === 'employer-service-order') {
      return <>
        <Grid item xs={12}>
          <Typography>ID: {order?.employerServiceOrder?.id}</Typography>
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            <Stack>
              <Typography>{order?.employerServiceOrder?.adminLegalEntityName}</Typography>
              <Typography>{order?.employerServiceOrder?.adminLegalEntityRepresentativeName}</Typography>
              <Typography>{order?.employerServiceOrder?.adminStreet} {order?.employerServiceOrder?.adminStreetNumber}</Typography>
              <Typography>{order?.employerServiceOrder?.adminPostCode} {order?.employerServiceOrder?.adminCity}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
              <ListItem>
                <ListItemText>
                  Solution
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.productTitle}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  Effort (hours)
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.employerServiceOrder?.durationHours}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  &euro;{order?.employerServiceOrder?.rateAmount}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Purchase Terms</Typography>
          <SanitizedHTML html={order?.employerServiceOrder?.description} />  
        </Grid>
      </>
    } else if (subOrderType === 'contractor-service-order') {
      return <>
        
        <Grid item xs={12}>
          <Typography>ID: {order?.employerServiceOrder?.id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <MainCard title="Talent">
            <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
              <ListItem>
                <ListItemText>
                  <Typography>VAT #</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.contractorServiceOrder?.contractorVatNumber}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Typography>Chamber of Commerce #</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.contractorServiceOrder?.contractorChamberOfCommerceIdentifier}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Grid item xs={6}>
          <MainCard title="10x.team">
            <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
              <ListItem>
                <ListItemText>
                  <Typography>VAT #</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.contractorServiceOrder?.adminVatNumber}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Typography>Chamber of Commerce #</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.contractorServiceOrder?.adminChamberOfCommerceIdentifier}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
              <ListItem>
                <ListItemText>
                  Solution
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.productTitle}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  Effort (hours)
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.employerServiceOrder?.durationHours}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  &euro;{order?.employerServiceOrder?.rateAmount}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5">Purchase Terms</Typography>
          <SanitizedHTML html={order?.employerServiceOrder?.description} />
        </Grid>
      </>;
    }
  };
  
  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 3, marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <GlobalFilter preGlobalFilteredRows={filteredOrders} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChangeSort}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }

                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {filteredOrders.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'ProductTitle') return compareSortValues(a?.productTitle, b?.productTitle);
              if (sortBy === 'ContractorName') return compareSortValues(a?.contractorName, b?.contractorName);
              return a;
            })
            .map((order, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <ProductOrderCard order={order} handleApproveClick={handleApproveClick} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyCardList title={'No product orders.'} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>

      <Dialog
        open={openServiceOrderDialog}
        onClose={() => {
          setOpenServiceOrderDialog(false);
          setOrderToView(null);
          setSubOrderTypeToView(null);
        }}
        keepMounted
        TransitionComponent={PopupTransition}
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogTitle>Service Order</DialogTitle>
        <DialogContent sx={{ mt: 2, my: 1 }}>

          <Grid container spacing={2}>
            {getServiceOrderContent(orderToView, subOrderTypeToView)}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                <Button fullWidth onClick={() => {
                  setOpenServiceOrderDialog(false);
                  setOrderToView(null);
                  setSubOrderTypeToView(null);
                }}
                  color="secondary"
                  variant="outlined">
                  Close
                </Button>
                {getIsServiceOrderApprovable(orderToView, subOrderTypeToView) && 
                  <Button fullWidth color="primary" variant="contained" onClick={handleApproveConfirmClick} autoFocus>
                    Approve
                  </Button>
                }
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductOrders;
