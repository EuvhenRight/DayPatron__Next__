import { useState, useEffect } from 'react';
import jobClusters from 'data/jobClusters';

// material-ui
import {
  Autocomplete,
  TextField,
  Grid,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Pagination,
  Typography,
  useMediaQuery
} from '@mui/material';

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import SubscriptionOfferCard from 'sections/subscription/SubscriptionOfferCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

// ==============================|| SUBSCRIPTION OFFERS - PAGE ||============================== //

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
    header: 'Description'
  }
];

const SubscriptionOffersPage = () => {
  const { keycloak } = useKeycloak();

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [subscriptionOffers, setSubscriptionOffers] = useState([]);
  const [filteredSubscriptionOffers, setFilteredSubscriptionOffers] = useState([]);
  const [page, setPage] = useState(1);

  const [jobClusterFilter, setJobClusterFilter] = useState(null);

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const bindSubscriptionOffers = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/subscription-offers?q=1';
      
      if (jobClusterFilter) {
        requestUrl += '&jobCluster=' + jobClusterFilter.code;
      }

      let response = await fetch(requestUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      if (!response.ok) {
        return;
      }

      let json = await response.json();

      setSubscriptionOffers(json.offers);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindSubscriptionOffers();
    })();
  }, [keycloak?.idToken, jobClusterFilter]);

  useEffect(() => {
    const newSubscriptionOffers = subscriptionOffers?.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredSubscriptionOffers(newSubscriptionOffers);
  }, [globalFilter, subscriptionOffers]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredSubscriptionOffers?.length / PER_PAGE);
  const _DATA = usePagination(filteredSubscriptionOffers, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner title="Talent Subscription Plan Offerings" subTitle="Subscribe to the Services of a Talent" />
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            Welcome to the talent subscription plan offerings center.
          </MainCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MainCard title="Filter">

            <Grid container direction="column" rowSpacing={3}>

              <Grid item>
                <Stack spacing={1}>
                  <Typography variant="h5">Category</Typography>
                  <Box>
                    <FormControl sx={{ minWidth: 120 }} fullWidth>
                      <Autocomplete
                        fullWidth
                        options={jobClusters ?? []}
                        value={jobClusterFilter}
                        onChange={(event, newValue) => {
                          setJobClusterFilter(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Category"
                            name="jobCluster"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password'
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard>
                <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center">
                  <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
                    <GlobalFilter preGlobalFilteredRows={filteredSubscriptionOffers} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                  </Stack>
                  <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
                    <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1}>
                      <Box>
                        <FormControl sx={{ minWidth: 120 }}>
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
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
            {filteredSubscriptionOffers?.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((subscriptionOffer, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={4}>
                      <SubscriptionOfferCard subscriptionOffer={subscriptionOffer} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No subscriptions.'} />
            )}
          </Grid>
        </Grid>
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

export default SubscriptionOffersPage;
