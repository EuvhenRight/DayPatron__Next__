import { useState, useEffect } from 'react';
import jobClusters from 'data/jobClusters';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  Slider,
  Dialog,
  DialogContent,
  InputLabel,
  Button,
  useMediaQuery
} from '@mui/material';

import InfoWrapper from 'components/InfoWrapper';
import { PopupTransition } from 'components/@extended/Transitions';
import Avatar from 'components/@extended/Avatar';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { openSnackbar } from 'store/reducers/snackbar';

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import ProductCard from 'sections/product/ProductCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody, compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

// ==============================|| PRODUCTS - PAGE ||============================== //

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

const ProductsPage = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const personalInformation = useSelector(state => state.personalInformation);
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 100000]);
  const [priceRangeFilterIndicator, setPriceRangeFilterIndicator] = useState([0, 100000]);

  const [jobClusterFilter, setJobClusterFilter] = useState(null);

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [employers, setEmployers] = useState(null);
  const [employerId, setEmployerId] = useState(null);
  const [productToBuy, setProductToBuy] = useState(null);

  const bindEmployers = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers?employerUserId=' + encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployers(json.employers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (openBuyDialog && !employers)
        await bindEmployers();
    })();
  }, [openBuyDialog, employers, personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    if (employers && employers.length > 0) {
      setEmployerId(employers[0].id);
    }
  }, [employers]);

  const bindProducts = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products?q=1';
      
      if (jobClusterFilter) {
        requestUrl += '&jobCluster=' + jobClusterFilter.code;
      }

      if (priceRangeFilter && priceRangeFilter[0] >= 0) {
        requestUrl += '&minimumPrice=' + priceRangeFilter[0];
      }

      if (priceRangeFilter && priceRangeFilter[1] >= 0) {
        requestUrl += '&maximumPrice=' + priceRangeFilter[1];
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

      setProducts(json.products);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindProducts();
    })();
  }, [keycloak?.idToken, jobClusterFilter, priceRangeFilter]);

  useEffect(() => {
    const newProducts = products.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredProducts(newProducts);
  }, [globalFilter, products]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredProducts?.length / PER_PAGE);
  const _DATA = usePagination(filteredProducts, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handlePriceRangeFilterSlider = (event, newValue) => {
    setPriceRangeFilter(newValue);
  };

  const handlePriceRangeFilterSliderIndicator = (event, newValue) => {
    setPriceRangeFilterIndicator(newValue);
  };

  const handleBuyClick = (product) => {
    setProductToBuy(product);
    setOpenBuyDialog(true);
  }

  const handleConfirmBuyClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + productToBuy.id + '/orders',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        },
        body: prepareApiBody({ employerId })
      }
    );

    if (!response.ok) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed placing an order.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );

      setOpenBuyDialog(false);
      return;
    }

    setOpenBuyDialog(false);

    let json = await response.json();

    dispatch(
      openSnackbar({
        open: true,
        message: "Placed order with id '" + json.id + "'",
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );

    navigate('/orders/my');
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner title="Discover the Power of the 10x Solution Suite" subTitle="Elevate your vision with curated excellence" />
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            Welcome to our Solution Suite - the pinnacle of tailored excellence within the 10x Portal for Companies. With precision-crafted solutions, we bring you a curated catalog designed to achieve your company&apos;s unique objectives. Harness the combined mastery of our top-tier talent to transform your goals into tangible reality.
            <br/>
            <br/>
            At 10x, we don&apos;t strive to offer the most options; we focus on offering only the best. Our Solution Suite epitomizes this philosophy, providing you with a curated selection of elite solutions, meticulously chosen to drive your company&apos;s success. Explore our ready catalog of excellence and elevate your vision today with the power of curated brilliance from 10x.
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

              <Grid item>
                <Stack spacing={1}>
                  <Typography variant="h5">Price</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack spacing={0.5}>
                      <Typography color="textSecondary">Min</Typography>
                      <TextField
                        value={priceRangeFilterIndicator[0]}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography color="textSecondary">Max</Typography>
                      <TextField
                        value={priceRangeFilterIndicator[1]}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Box sx={{ px: 0.75 }}>
                    <Slider min={0} max={100000} value={priceRangeFilterIndicator} onChange={handlePriceRangeFilterSliderIndicator} onChangeCommitted={handlePriceRangeFilterSlider} valueLabelDisplay="auto" />
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
                    <GlobalFilter preGlobalFilteredRows={filteredProducts} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
            {filteredProducts?.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((product, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6}>
                      <ProductCard product={product} onBuyClick={() => handleBuyClick(product)} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No products.'} />
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

      <Dialog
        open={openBuyDialog}
        onClose={() => { setOpenBuyDialog(false); }}
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="xs"
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar color="primary" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <ShoppingCartOutlined />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                You are about to buy solution &apos;{productToBuy?.title}&apos;. Select the company for which you want to place the order:
              </Typography>

              {employers?.length > 0 ?
                (<Stack spacing={1.25}>
                  <InfoWrapper tooltipText="product_buy_company">
                    <InputLabel htmlFor="company-name">Company</InputLabel>
                  </InfoWrapper>
                  <Select
                    fullWidth
                    id="employerId"
                    name="employerId"
                    displayEmpty
                    value={normalizeInputValue(employerId)}
                    onChange={(event) => { setEmployerId(event.target.value); }}
                  >
                    {employers?.map((employer) => (
                      <MenuItem key={employer?.id} value={employer?.id}>
                        {employer?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>)
                :
                (<Typography>No companies found.</Typography>)
              }

            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button disabled={!employerId} fullWidth color="primary" variant="contained" onClick={() => handleConfirmBuyClick()} autoFocus>
                Buy
              </Button>
              <Button fullWidth onClick={() => { setOpenBuyDialog(false); }} color="secondary" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsPage;
