import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SanitizedHTML from 'react-sanitized-html';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import {
  Grid,
  CardMedia,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogContent,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import InfoWrapper from 'components/InfoWrapper';
import { PopupTransition } from 'components/@extended/Transitions';
import Avatar from 'components/@extended/Avatar';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { openSnackbar } from 'store/reducers/snackbar';

// project imports
import MainCard from 'components/MainCard';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
const avatarImage = require.context('assets/images/products', true);

// ==============================|| PRODUCT DETAILS - MAIN ||============================== //

const ProductDetails = () => {
  const { keycloak } = useKeycloak();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);

  const [product, setProduct] = useState(null);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [employers, setEmployers] = useState(null);
  const [employerId, setEmployerId] = useState(null);
  
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
  }, [openBuyDialog]);

  useEffect(() => {
    if (employers && employers.length > 0) {
      setEmployerId(employers[0].id);
    }
  }, [employers]);

  const bindProduct = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + productId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setProduct(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (productId) {
        await bindProduct();
      }
    })();
  }, [productId]);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(product?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [product?.mainImageUrl]);

  const getImageSrc = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return avatarImage(`./default.png`);
      }

      let response = await fetch(imageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyClick = () => {
    setOpenBuyDialog(true);
  }

  const handleConfirmBuyClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + productId + '/orders',
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
  };

  return (
    <>
      {product && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>

                  <CardMedia
                    image={avatar}
                    component="img"
                    sx={{ borderRadius: `4px`, position: 'relative' }}
                  />

                </Grid>
                <Grid item xs={12} sm={8}>

                  <Stack spacing={2}>
                    <Typography variant="h3">{product?.title}</Typography>
                    <SanitizedHTML html={product?.description} />
                    <Typography variant="h3">&euro;{product?.price}</Typography>
                    <Button onClick={() => handleBuyClick()} fullWidth color="primary" variant="contained" size="large">
                      Buy Now
                    </Button>
                  </Stack>

                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={openBuyDialog}
        onClose={() => { setOpenBuyDialog(false); } }
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
                You are about to buy product &apos;{product?.title}&apos;. Select the company for which you want to place the order:
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

export default ProductDetails;
