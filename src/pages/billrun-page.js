import { useState, useEffect } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';

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
import BillingInformationCard from 'sections/billing/BillingInformationCard';

import { compareSortValues } from 'utils/stringUtils';

// ==============================|| BILLRUN - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Creation DateTime'
  },
  {
    id: 3,
    header: 'Item Name'
  },
  {
    id: 4,
    header: 'Company Name'
  },
  {
    id: 5,
    header: 'Talent name'
  }
];

const InvoicesBillRunPage = () => {
  const { keycloak } = useKeycloak();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [billingInformation, setBillingInformation] = useState([]);
  const [filteredBillingInformation, setFilteredBillingInformation] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('')
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState('Id');
  const [page, setPage] = useState(1);

  const handleSubmitBillRun = async () => {
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
  }

  const bindBillingInformation = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing?billingStatus=' + 'pending',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          }
        }
      );

      let json = await response.json();
      setBillingInformation(json.billingInformation);
      setFilteredBillingInformation(json.billingInformation);
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
      await bindBillingInformation();
    })();
  }, []);

  useEffect(() => {
    const newBillingInformation = billingInformation.filter((value) => {
      if (globalFilter) {
        return value.employerName.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredBillingInformation(newBillingInformation);
  }, [globalFilter]);

  const PER_PAGE = 10;
  const count = Math.ceil(filteredBillingInformation.length / PER_PAGE);
  const _DATA = usePagination(filteredBillingInformation, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };


  return (

    <Grid container>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start date"
            value={startDate}
            onChange={(startDateValue) => {
              setStartDate(startDateValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End date"
            value={endDate}
            onChange={(endDateValue) => {
              setEndDate(endDateValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          onClick={() => {
            handleSubmitBillRun()
          }}
          variant="contained"
        >
          Submit
        </Button>
      </Grid>

      <Grid item xs={12}>
        <>
          <Box sx={{ position: 'relative', marginBottom: 3 }}>
            <Stack direction="row" alignItems="center">
              <Stack
                direction={matchDownSM ? 'column' : 'row'}
                sx={{ width: '100%' }}
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <GlobalFilter preGlobalFilteredRows={filteredBillingInformation} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
            {filteredBillingInformation.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'CreatedAtUtc') return compareSortValues(a?.createdAtUtc, b?.createdAtUtc);
                  if (sortBy === 'ItemName') return compareSortValues(a?.itemName, b?.itemName);
                  if (sortBy === 'CompanyName') return compareSortValues(a?.itemName, b?.itemName);
                  if (sortBy === 'TalentName') return compareSortValues(a?.itemName, b?.itemName);
                  return a;
                })
                .map((billingInformation, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <BillingInformationCard billingInformation={billingInformation} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No records in billinginformation.'} />
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
      </Grid>
    </Grid>
  );
};

export default InvoicesBillRunPage;