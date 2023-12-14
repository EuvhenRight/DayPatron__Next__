import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SanitizedHTML from 'react-sanitized-html';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import {
  Grid,
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
  ListItemIcon,
  Box,
  Chip
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
import jobClusters from 'data/jobClusters';

import { PlayCircleOutlined } from '@ant-design/icons';

const avatarImageContractor = require.context('assets/images/users', true);

const SubscriptionPage = () => {
  const { keycloak } = useKeycloak();
  const { subscriptionOfferId } = useParams();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);

  const [subscriptionOffer, setSubscriptionOffer] = useState(null);
  const [avatarContractor, setAvatarContractor] = useState(avatarImageContractor(`./default.png`));
  const [planToSubscribe, setPlanToSubscribe] = useState(false);
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
      if (planToSubscribe && !employers)
        await bindEmployers();
    })();
  }, [planToSubscribe, employers, personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    if (employers && employers.length > 0) {
      setEmployerId(employers[0].id);
    }
  }, [employers]);

  const bindSubscriptionOffer = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/subscription-offers/' + subscriptionOfferId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setSubscriptionOffer(json?.offer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (subscriptionOfferId) {
        await bindSubscriptionOffer();
      }
    })();
  }, [subscriptionOfferId, keycloak?.idToken]);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(subscriptionOffer?.contractorMainImageUrl, avatarImageContractor(`./default.png`));
      setAvatarContractor(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [subscriptionOffer?.contractorMainImageUrl, keycloak?.idToken]);

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

  const handleSubscribeClick = (plan) => {
    setPlanToSubscribe(plan);
  }

  const handleConfirmSubscribeClick = async () => {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders',
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

      setPlanToSubscribe(null);
      return;
    }

    setPlanToSubscribe(null);

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
      {subscriptionOffer && (
        <Grid container spacing={3}>

          <Grid item xs={12}>

            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar src={avatarContractor} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Subscripion plans by &apos;{subscriptionOffer?.contractorFirstName + ' ' + subscriptionOffer?.contractorLastName}&apos;</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Talent has {subscriptionOffer?.plans?.length <= 1 ? 'no' : subscriptionOffer?.plans?.length} plan(s)
                    </Typography>
                  }
                />
              </ListItem>
            </List>

          </Grid>

          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>

                  <Stack spacing={2}>
                    <SanitizedHTML html={subscriptionOffer?.summary} />

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0,
                        m: 0
                      }}
                      component="ul"
                    >
                      {subscriptionOffer?.clusters?.map((cluster, clusterIndex) => (
                        <ListItem disablePadding key={clusterIndex} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                          <Chip color="primary" variant="outlined" size="small" label={jobClusters.find(x => x.code === cluster)?.label} />
                        </ListItem>
                      ))}
                    </Box>
                  </Stack>

                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          {subscriptionOffer?.plans?.map((plan, planIndex) => (
            <Grid item xs={12} sm={4} key={planIndex}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      <Typography variant="h3">{plan?.title}</Typography>

                      {plan?.features?.map((feature, featureIndex) => (
                        <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0 } }} key={featureIndex}>
                          <ListItem>
                            <ListItemIcon>
                              <PlayCircleOutlined />
                            </ListItemIcon>
                            <ListItemText primary={<Typography color="secondary">{feature}</Typography>} />
                          </ListItem>
                        </List>
                      ))}
                      

                      <Button onClick={() => handleSubscribeClick(plan)} fullWidth color="primary" variant="contained" size="large">
                        Subscribe
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
                  
              </MainCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={planToSubscribe}
        onClose={() => { setPlanToSubscribe(null); } }
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
                You are about to subscribe to plan &apos;{planToSubscribe?.title}&apos;. Select the company for which you want to place the order:
              </Typography>

              {employers?.length > 0 ?
                (<Stack spacing={1.25}>
                  <InfoWrapper tooltipText="plan_subscribe_company">
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
              <Button disabled={!employerId} fullWidth color="primary" variant="contained" onClick={() => handleConfirmSubscribeClick()} autoFocus>
                Subscribe
              </Button>
              <Button fullWidth onClick={() => { setPlanToSubscribe(null); }} color="secondary" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default SubscriptionPage;
