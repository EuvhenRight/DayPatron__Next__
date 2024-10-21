import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Pagination,
  Typography,
  Dialog,
  DialogContent
} from '@mui/material';

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import ProductCard from 'sections/product/ProductCard';
import AlertProductDelete from 'sections/product/AlertProductDelete';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';
import { PopupTransition } from 'components/@extended/Transitions';

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

const MyProductsPage = () => {
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const personalInformation = useSelector(state => state.personalInformation);
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openProductUpsertedDialog, setOpenProductUpsertedDialog] = useState(location.state?.showProductUpsertedDialog ? true : false);
  
  const bindProducts = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/products',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setProducts(json.products);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    navigate('/solutions/create');
  };

  const handleDeleteAlertClose = () => {
    setOpenDeleteAlert(false);
    setProductToDelete(null);
  };

  const alertProductToDelete = (product) => {
    setOpenDeleteAlert(true);
    setProductToDelete(product);
  };

  useEffect(() => {
    (async () => {
      await bindProducts();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

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

  const count = Math.ceil(filteredProducts.length / PER_PAGE);
  const _DATA = usePagination(filteredProducts, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner title="Elevate Your Impact with Tailored Solutions" subTitle="Propose Your Solution and Shape the Future" />
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            Welcome to the Solutions page, a section that empowers you to contribute your expertise and innovative ideas to our customers. Solutions are fixed price, fixed scope products that you can create. Submit your Solution and be a driving force in transforming industries. Fill in a sharp description of your Solution Snapshot, Outcome Odyssey, Deliverables Delights, and Approach Alchemy. Our team will carefully review your submission, ensuring it aligns with our standards of excellence.
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
                alignItems="center"
              >
                <GlobalFilter preGlobalFilteredRows={filteredProducts} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                    Create Solution
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            {filteredProducts.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((product, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <ProductCard product={product} alertProductToDelete={alertProductToDelete} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No solutions.'} />
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

      <AlertProductDelete product={productToDelete} open={openDeleteAlert} handleClose={handleDeleteAlertClose} onArchive={bindProducts} />

      <Dialog
        open={openProductUpsertedDialog}
        onClose={() => { setOpenProductUpsertedDialog(false);} }
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="xs"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Typography>10x will approve, reject or come back to you with feedback about the changes to your solution.</Typography>
          <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => {setOpenProductUpsertedDialog(false);}}>OK</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyProductsPage;
