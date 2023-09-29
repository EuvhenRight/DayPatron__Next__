import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Link,
  Checkbox,
  FormControlLabel,
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
import MissionOrderCard from 'sections/order/MissionOrderCard';
import { PopupTransition } from 'components/@extended/Transitions';
import SanitizedHTML from 'react-sanitized-html';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';
import { PlusOutlined } from '@ant-design/icons';

import countries from 'data/countries';

// ==============================|| ORDERS - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'MissionTitle'
  },
  {
    id: 3,
    header: 'ContractorName'
  }
];

const MissionOrders = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
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
  const [roleToView, setRoleToView] = useState(null);
  const [hasAcceptedProjectOrderTerms, setHasAcceptedProjectOrderTerms] = useState(null);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredOrders.length / PER_PAGE);
  const _DATA = usePagination(filteredOrders, PER_PAGE);

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

  const bindOrders = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders?employerUserId=' + encodeURIComponent(personalInformation.id),
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

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleApproveConfirmClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders/' + orderToView.id + '/' + subOrderTypeToView + 's/' + roleToView + '-approvals',
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

  const handleApproveClick = (order, subOrderType, role) => {
    setOpenServiceOrderDialog(true);
    setOrderToView(order);
    setSubOrderTypeToView(subOrderType);
    setRoleToView(role);
    setHasAcceptedProjectOrderTerms(false);
  };

  const handleProjectOrderTermsClick = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders/project-order-terms',
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

  const getIsServiceOrderApprovable = (order, subOrderType, role) => {
    if (!hasAcceptedProjectOrderTerms) {
      return false;
    }

    if (subOrderType === 'employer-service-order') {
      if (role === 'employer')
        return order?.employerServiceOrder?.employerStatus === 'Pending';
    }

    return false;
  };

  const handleAdd = () => {
    navigate('/missions/orders/create');
  }

  const getServiceOrderContent = (order, subOrderType, role) => {
    if (!order)
      return;

    if (subOrderType === 'employer-service-order') {
      return <>
        <Grid item xs={12}>
          <Typography>ID: {order?.employerServiceOrder?.id}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard>
            <Stack>
              <Typography>{order?.employerLegalEntityName}</Typography>
              <Typography>{order?.employerLegalEntityRepresentativeName}</Typography>
              <Typography>{order?.employerStreet} {order?.employerStreetNumber}</Typography>
              <Typography>{order?.employerPostCode} {order?.employerCity}</Typography>
              <Typography>{countries.find(x => x.code === order?.employerCountry)?.label}</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard>
            <Stack>
              <Typography>{order?.adminLegalEntityName}</Typography>
              <Typography>{order?.adminLegalEntityRepresentativeName}</Typography>
              <Typography>{order?.adminStreet} {order?.adminStreetNumber}</Typography>
              <Typography>{order?.adminPostCode} {order?.adminCity}</Typography>
              <Typography>{countries.find(x => x.code === order?.adminCountry)?.label}</Typography>
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
                  {order?.contractorName}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Mission
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.missionTitle}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  Effort
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.employerServiceOrder?.duration}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography>Rate Type</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.employerServiceOrder?.rateType}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography>Rate</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  &euro;{order?.employerServiceOrder?.rateAmount}
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText>
                  <Typography>Total Amount</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  {order?.employerServiceOrder?.totalAmount}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Purchase Terms</Typography>
          <SanitizedHTML html={order?.employerServiceOrder?.description} />
        </Grid>
        {keycloak.tokenParsed.roles.includes('employer') && role === 'employer' &&
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={hasAcceptedProjectOrderTerms} onChange={(event) => setHasAcceptedProjectOrderTerms(event.target.checked)} color="primary" />}
              label={<p>I have read and agree to the <Link href="#" onClick={handleProjectOrderTermsClick}>Project Contract Terms &amp; Conditions</Link> that are applicable to this Service Order.</p>}
            />
          </Grid>
        }
      </>
    } 

    return;
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
              {keycloak.tokenParsed.roles.includes('admin') &&
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                  Create Mission Order
                </Button>
              }
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {filteredOrders.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'MissionTitle') return compareSortValues(a?.missionTitle, b?.missionTitle);
              if (sortBy === 'ContractorName') return compareSortValues(a?.contractorName, b?.contractorName);
              return a;
            })
            .map((order, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <MissionOrderCard order={order} handleApproveClick={handleApproveClick} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyCardList title={'No mission orders.'} />
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
            {getServiceOrderContent(orderToView, subOrderTypeToView, roleToView)}
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
                <Button disabled={!getIsServiceOrderApprovable(orderToView, subOrderTypeToView, roleToView)} fullWidth color="primary" variant="contained" onClick={handleApproveConfirmClick} autoFocus>
                  Approve
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionOrders;
