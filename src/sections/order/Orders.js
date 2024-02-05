import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  Typography
} from '@mui/material';

import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import MissionOrderCard from 'sections/order/MissionOrderCard';
import ProductOrderCard from 'sections/order/ProductOrderCard';
import SubscriptionOrderCard from 'sections/order/SubscriptionOrderCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';

// ==============================|| ORDERS - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Title'
  },
  {
    id: 3,
    header: 'Employer'
  }
];

const Orders = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const personalInformation = useSelector(state => state.personalInformation);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);

  const PER_PAGE = 50;

  const count = Math.ceil(filteredOrders.length / PER_PAGE);
  const _DATA = usePagination(filteredOrders, PER_PAGE);

  useEffect(() => {
    (async () => {
      await bindOrders();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    const newOrders = orders.filter((value) => {
      if (globalFilter) {
        return value.itemTitle.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredOrders(newOrders);
  }, [globalFilter, orders]);

  const bindOrders = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/orders?contractorId=' + encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setOrders(json.orders);
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

  const handleApproveMissionOrderClick = (order) => {
    navigate('/orders/mission-orders/' + order.id + '/talent-service-order');
  };

  const handleApproveProductOrderClick = (order) => {
    navigate('/orders/solution-orders/' + order.id + '/talent-service-order');
  };

  const handleApproveSubscriptionOrderClick = (order) => {
    navigate('/orders/subscription-orders/' + order.id + '/talent-service-order');
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
              if (sortBy === 'Title') return compareSortValues(a?.itemTitle, b?.itemTitle);
              if (sortBy === 'Employer') return compareSortValues(a?.employerName, b?.employerName);
              return a;
            })
            .map((order, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  {order.type === 'MissionOrder' &&
                    <MissionOrderCard order={order} handleApproveClick={handleApproveMissionOrderClick} />
                  }
                  {order.type === 'ProductOrder' &&
                    <ProductOrderCard order={order} handleApproveClick={handleApproveProductOrderClick} />
                  }
                  {order.type === 'SubscriptionOrder' &&
                    <SubscriptionOrderCard order={order} handleApproveClick={handleApproveSubscriptionOrderClick} />
                  }
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyCardList title={'No orders.'} />
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
    </>
  );
};

export default Orders;
