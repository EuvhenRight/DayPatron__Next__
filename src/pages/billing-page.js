import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';
import CircularProgress from '@mui/material/CircularProgress';

import { PopupTransition } from 'components/@extended/Transitions';
// material-ui
import {
  Button,
  Grid,
  Stack,
  Box,
  Typography,
  FormControl,
  Slide,
  Pagination,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
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
  const [selectedBillingInfoIds, setSelectedBillingInfoIds] = useState([]);
  const [notificationRecipientTypes, setNotificationRecipientTypes] = useState(null);
  const [sendingNotifications, setSendingNotifications] = useState(false);

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
    }
    catch (error) {
      console.log(error)
    }
  }
  
  const handleConfirmSend = async () => {
    await sendBillingNotifications(notificationRecipientTypes);
  }

  const sendBillingNotifications = async (recipientTypes) => {
    setSendingNotifications(true);
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing/notifications',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({ recipientTypes, billingInfoIds: selectedBillingInfoIds })
      }
    );

    if (!response.ok) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed sending notifications.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      setSendingNotifications(false);
      setNotificationRecipientTypes(null);
      return;
    }

    bindBillingInfo();

    let json = await response.json();

    dispatch(
      openSnackbar({
        open: true,
        message: `${json?.countSuccesses} of ${json?.countAttempts} notifications sent.`,
        variant: 'alert',
        alert: {
          color: json?.countSuccesses >= json?.countAttempts ? 'success' : 'warning'
        },
        close: false
      })
    );
    setSendingNotifications(false);
    setNotificationRecipientTypes(null);
  };

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindBillingInfo();
    })();
  }, [keycloak.idToken]);

  useEffect(() => {
    const newBillingInfo = billingInfo.filter((value) => {
      if (globalFilter) {
        return value.itemName.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredBillingInfo(newBillingInfo);

    let filteredIds = selectedBillingInfoIds.filter(x => newBillingInfo.find(n => n.id === x));
    setSelectedBillingInfoIds(filteredIds);

  }, [globalFilter, billingInfo]);

  const PER_PAGE = 100;
  const count = Math.ceil(filteredBillingInfo.length / PER_PAGE);
  const _DATA = usePagination(filteredBillingInfo, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const toggleBillingInfoSelection = (billingInfoId) => {
    let newItems = [...selectedBillingInfoIds];
    let foundItemIndex = newItems.indexOf(billingInfoId);
    
    if(foundItemIndex >= 0)
      newItems.splice(foundItemIndex, 1);
    else
      newItems.push(billingInfoId);

    setSelectedBillingInfoIds(newItems);
  };

  const getIsSelected = (billingInfoId) => {
    return selectedBillingInfoIds?.includes(billingInfoId);
  };

  const toggleAllBillingInfosSelection = (event) => {
    if(event.target.checked) {
      let ids = filteredBillingInfo.map(x => x.id);
      setSelectedBillingInfoIds(ids);
    } else {
      setSelectedBillingInfoIds([]);
    }
  };

  const getAreAllBillingInfosSelected = () => {
    return filteredBillingInfo.every(x => selectedBillingInfoIds.includes(x.id));
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
                  format="dd-MM-yyyy" />
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={(endDateValue) => {
                    let newValue = new Date(endDateValue.getFullYear(), endDateValue.getMonth(), endDateValue.getDate(), 23, 59, 59, 999);
                    setEndDate(newValue);
                  }}
                  format="dd-MM-yyyy"/>
                <Button
                  onClick={() => {
                    handleSubmitBillRun()
                  }}
                  variant="contained">
                  {isRunningBillRun === true ? <CircularProgress size={20} /> : "Submit"}
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
                  
                <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} alignItems="center">
                  <GlobalFilter preGlobalFilteredRows={filteredBillingInfo} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                  <FormControlLabel
                    control={<Checkbox color="primary" checked={getAreAllBillingInfosSelected()} onChange={toggleAllBillingInfosSelection} />}
                    label="Select all"
                  />
                  <Button variant='outlined' onClick={() => setNotificationRecipientTypes(['test'])}>Send test</Button>
                </Stack>
                
                <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
                  <Button variant='outlined' onClick={() => setNotificationRecipientTypes(['contractor'])}>Send to talent</Button>
                  <Button variant='outlined' onClick={() => setNotificationRecipientTypes(['employer'])}>Send to company</Button>
                  <Button variant='outlined' onClick={() => setNotificationRecipientTypes(['accountant'])}>Send to accountant</Button>
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
                    <Grid item xs={12}>
                      <BillingInfoCard billingInfo={billingInfo} toggleBillingInfoSelection={toggleBillingInfoSelection} isSelected={getIsSelected(billingInfo?.id)}/>
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

      <Dialog
        open={notificationRecipientTypes}
        onClose={() => { setNotificationRecipientTypes(null); }}
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="xs"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Typography variant="h4" align="center">
              Are you sure you want to send notifications?
            </Typography>
            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button disabled={sendingNotifications} fullWidth color="primary" variant="contained" onClick={async () => await handleConfirmSend()} autoFocus>
                Send
              </Button>
              <Button fullWidth onClick={() => { setNotificationRecipientTypes(null); }} color="secondary" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default InvoicesBillingPage;