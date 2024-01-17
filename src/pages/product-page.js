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
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import TabPanel from 'components/TabPanel';
import InfoWrapper from 'components/InfoWrapper';
import { PopupTransition } from 'components/@extended/Transitions';
import Avatar from 'components/@extended/Avatar';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { openSnackbar } from 'store/reducers/snackbar';
import WelcomeBanner from 'sections/WelcomeBanner';

// project imports
import MainCard from 'components/MainCard';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import jobClusters from 'data/jobClusters';
import { useNavigate } from 'react-router-dom';

const avatarImage = require.context('assets/images/products', true);
const avatarImageContractor = require.context('assets/images/users', true);

// ==============================|| PRODUCT DETAILS - MAIN ||============================== //

const ProductDetails = () => {
  const { keycloak } = useKeycloak();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const personalInformation = useSelector(state => state.personalInformation);

  const [product, setProduct] = useState(null);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const [avatarContractor, setAvatarContractor] = useState(avatarImageContractor(`./default.png`));
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [employers, setEmployers] = useState(null);
  const [employerId, setEmployerId] = useState(null);
  const [selectedFeaturesTabIndex, setSelectedFeaturesTabIndex] = useState(0);

const handleChangeFeaturesTab = (event, newValue) => {
	setSelectedFeaturesTabIndex(newValue);
};

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
  }, [productId, keycloak?.idToken]);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(product?.mainImageUrl, avatarImage(`./default.png`));
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [product?.mainImageUrl, keycloak?.idToken]);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(product?.contractorMainImageUrl, avatarImageContractor(`./default.png`));
      setAvatarContractor(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [product?.contractorMainImageUrl, keycloak?.idToken]);

  const getImageSrc = async (imageUrl, defaultImage) => {
    try {
      if (!imageUrl) {
        return defaultImage;
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

  const handleBackClick = () => {
    navigate('/solutions');
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
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <WelcomeBanner title={product?.title} subTitle={jobClusters.find(x => x.code === product?.cluster)?.label} />
          </Grid>

          <Grid item xs={12}>

            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar src={avatarContractor} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Solution by &apos;{product?.contractorFirstName + ' ' + product?.contractorLastName}&apos;</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Talent has {product?.contractorProductsCount <= 1 ? 'no' : product?.contractorProductsCount - 1} other solution(s)
                    </Typography>
                  }
                />
              </ListItem>
            </List>

          </Grid>
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

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack spacing={2}>
                        <Typography variant="h3">{product?.title}</Typography>
                        <SanitizedHTML html={product?.description} />
                        <Typography variant="h3">&euro;{product?.adminPrice}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button onClick={() => handleBuyClick()} fullWidth color="primary" variant="contained" size="large">
                        Buy Now
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button onClick={() => handleBackClick()} fullWidth color="secondary" variant="outlined" size="large">
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12}>
            <MainCard>
              <Stack spacing={3}>
                <Stack>
                  <Tabs
                    value={selectedFeaturesTabIndex}
                    indicatorColor="primary"
                    onChange={handleChangeFeaturesTab}
                    variant="scrollable"
                  >
                    <Tab label="Outcome Odyssey" />
                    <Tab label="Deliverables Delights" />
                    <Tab label="Approach Alchemy" />
                  </Tabs>
                  <Divider />
                </Stack>
                <TabPanel value={selectedFeaturesTabIndex} index={0}>
                  <Stack spacing={3}>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Outcome Description</Typography>
                      <SanitizedHTML html={product?.outcomeDescription ?? '-'} />
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Outcome Importance</Typography>
                      <SanitizedHTML html={product?.outcomeImportance ?? '-'} />
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Outcome Benefits</Typography>
                      <SanitizedHTML html={product?.outcomeBenefits ?? '-'} />
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel value={selectedFeaturesTabIndex} index={1}>
                <Stack spacing={3}>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Deliverables</Typography>
                      <SanitizedHTML html={product?.deliverables ?? '-'} />
                    </Stack>
                  </Stack>
                </TabPanel>
                <TabPanel value={selectedFeaturesTabIndex} index={2}>
                  <Stack spacing={3}>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Approach Methodology</Typography>
                      <SanitizedHTML html={product?.approachMethodology ?? '-'} />
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Approach Best Practices</Typography>
                      <SanitizedHTML html={product?.approachBestPractices ?? '-'} />
                    </Stack>
                    <Stack spacing={0.25}>
                      <Typography color="secondary">Approach Success Stories</Typography>
                      <SanitizedHTML html={product?.approachSuccessStories ?? '-'} />
                    </Stack>
                  </Stack>
                </TabPanel>
              </Stack>
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
                You are about to buy solution &apos;{product?.title}&apos;. Select the company for which you want to place the order:
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
