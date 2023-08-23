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
  Slider,
  useMediaQuery
} from '@mui/material';

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import ProductCard from 'sections/product/ProductCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from '../components/MainCard';

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

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 100000]);
  const [priceRangeFilterIndicator, setPriceRangeFilterIndicator] = useState([0, 100000]);

  const [jobClusterFilter, setJobClusterFilter] = useState(null);

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
      setFilteredProducts(json.products);
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
  }, [jobClusterFilter, priceRangeFilter]);

  useEffect(() => {
    const newProducts = products.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredProducts(newProducts);
  }, [globalFilter]);

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

  return (
    <>
      <Grid container spacing={3}>
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
                      <ProductCard product={product} />
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
    </>
  );
};

export default ProductsPage;
