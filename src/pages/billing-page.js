import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';
import CircularProgress from '@mui/material/CircularProgress';

// material-ui
import {
  Button,
  Grid,
  TextField,
  Stack,
  Box,
  Typography,
  FormControl,
  Slide,
  Pagination,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material';

import { openSnackbar } from 'store/reducers/snackbar';
import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// project imports
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import BillingInfoCard from 'sections/billing/BillingInfoCard';
import MainCard from 'components/MainCard';
import { compareSortValues } from 'utils/stringUtils';

// ==============================|| BILLRUN - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Creation Date'
  },
  {
    id: 3,
    header: 'Item Name'
  }
];

const InvoicesBillingPage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [billingInfo, setBillingInfo] = useState([]);
  const [filteredBillingInfo, setFilteredBillingInfo] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('')
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState('Id');
  const [page, setPage] = useState(1);
  const [isRunningBillRun, setIsRunningBillRun] = useState(false);

  const handleSubmitBillRun = async () => {

    setIsRunningBillRun(true);

    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing/generate',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({ startDate, endDate })
      }
    );

    if (response.status === 204) {
      dispatch(
        openSnackbar(
          {
            open: true,
            message: 'Nothing to process.',
            variant: 'alert',
            alert: {
              color: 'info'
            },
            close: false
          }
        )
      )
    }

    if (response.status === 200) {

      let json = await response.json();

      if (json.totalFailedItems > 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Bill run partially failed ' + json.totalFailedItems + ' failed from ' + json.totalItems + ' items.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        )
      }
      else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Bill run executed. Generated invoices for ' + json.totalItems + ' items.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        )
      }
    }

    if (!response.ok) {
      dispatch(
        openSnackbar(
          {
            open: true,
            message: 'Failed to generate bill run.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          }
        )
      )
    }


    bindBillingInfo();
    setIsRunningBillRun(false);
  }

  const bindBillingInfo = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          }
        }
      );

      let json = await response.json();
      setBillingInfo(json.billingInfo);
      setFilteredBillingInfo(json.billingInfo);
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindBillingInfo();
    })();
  }, []);

  useEffect(() => {
    const newBillingInfo = billingInfo.filter((value) => {
      if (globalFilter) {
        return value.itemName.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredBillingInfo(newBillingInfo);
  }, [globalFilter]);

  const PER_PAGE = 12;
  const count = Math.ceil(filteredBillingInfo.length / PER_PAGE);
  const _DATA = usePagination(filteredBillingInfo, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthorized</Typography>

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard
            title={<Typography variant="h5">Bill run generation</Typography>}
            sx={{ height: 150, ' & .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={(startDateValue) => {
                    setStartDate(startDateValue);
                  }}
                  renderInput={(params) => <TextField {...params} />} />
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={(endDateValue) => {
                    setEndDate(endDateValue);
                  }}
                  renderInput={(params) => <TextField {...params} />} />
                <Button
                  onClick={() => {
                    handleSubmitBillRun()
                  }}
                  variant="contained">
                  Submit
                  {isRunningBillRun && <CircularProgress size={20} />}
                </Button>
              </Stack>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ position: 'relative', marginBottom: 3 }}>
            <Stack direction="row" alignItems="center">
              <Stack
                direction={matchDownSM ? 'column' : 'row'}
                sx={{ width: '100%' }}
                spacing={1}
                justifyContent="space-between"
                alignItems="center">
                <GlobalFilter preGlobalFilteredRows={filteredBillingInfo} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
                      }}>
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
            {filteredBillingInfo.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Creation Date') return compareSortValues(a?.createdAtUtc, b?.createdAtUtc);
                  if (sortBy === 'Item Name') return compareSortValues(a?.itemName, b?.itemName);
                  return a;
                })
                .map((billingInfo, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <BillingInfoCard billingInfo={billingInfo} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No records in billinginfo.'} />
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
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default InvoicesBillingPage;