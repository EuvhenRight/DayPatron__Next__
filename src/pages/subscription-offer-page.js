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
  Chip,
  Divider,
  FormHelperText,
  TextField
} from '@mui/material';

import * as Yup from 'yup';

import { useFormik, Form, FormikProvider } from 'formik';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import InfoWrapper from 'components/InfoWrapper';
import { PopupTransition } from 'components/@extended/Transitions';
import Avatar from 'components/@extended/Avatar';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { openSnackbar } from 'store/reducers/snackbar';

// project imports
import MainCard from 'components/MainCard';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody, normalizeNullableInputValue } from 'utils/stringUtils';
import jobClusters from 'data/jobClusters';

import { CheckOutlined } from '@ant-design/icons';
import rateTypes from 'data/rateTypes';
import { useTheme } from '@mui/material/styles';

const avatarImageContractor = require.context('assets/images/users', true);

const SubscriptionPage = () => {
  const theme = useTheme();
  const { keycloak } = useKeycloak();
  const { subscriptionOfferId } = useParams();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);

  const [subscriptionOffer, setSubscriptionOffer] = useState(null);
  const [avatarContractor, setAvatarContractor] = useState(avatarImageContractor(`./default.png`));
  const [planToSubscribe, setPlanToSubscribe] = useState(false);
  const [employers, setEmployers] = useState(null);

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
  };

  const getInitialValues = () => {
    const result = {
      employerId: null,
      startDate: null,
      durationCycles: null
    };
  
    return result;
  };

  const SubscriptionOrdersSchema = Yup.object().shape({
    employerId: Yup.string().required('Company is required').nullable(true),
    startDate: Yup.string().required('Start Date is required').nullable(true),
    durationCycles: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(1000, "Maximum 1000").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    validationSchema: SubscriptionOrdersSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        values.subscriptionPlanId = planToSubscribe.id;
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody(values)
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
        setSubmitting(false);
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
      setSubmitting(false);

      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <>
      {subscriptionOffer && (
        <Grid container spacing={3}>

          <Grid item xs={12}>

            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar sx={{ pr: 2 }}>
                  <Avatar src={avatarContractor} size="xxl" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack>
                      <Typography variant='h3'>{subscriptionOffer?.title}</Typography>
                      <Typography variant="h5">Subscripion plans by &apos;{subscriptionOffer?.contractorFirstName + ' ' + subscriptionOffer?.contractorLastName}&apos;</Typography>
                    </Stack>
                    
                  }
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Subscription offer has {subscriptionOffer?.plans?.length <= 1 ? 'no' : subscriptionOffer?.plans?.length} plan(s)
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
          {subscriptionOffer?.description &&
            <Grid item xs={12}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>

                    <SanitizedHTML html={subscriptionOffer?.description} />

                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          }

          {subscriptionOffer?.plans?.map((plan, planIndex) => (
            <Grid item xs={12} sm={4} key={planIndex}>
              <MainCard sx={{height: "100%"}}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>

                    <Stack spacing={4}>

                      <Stack spacing={3} alignItems="center">
                        <Typography variant="h3">{plan?.title}</Typography>
                        <Stack alignItems="center">
                          <Typography variant="h5">&euro;{plan?.rateAmount} / {rateTypes.find((item) => item.code === plan?.rateType).itemLabel}</Typography>
                          <Typography variant="caption" color="secondary">{plan?.minimumDurationCycles} {rateTypes.find((item) => item.code === plan?.rateType).itemLabel}(s) minimum</Typography>
                        </Stack>

                        <Button onClick={() => handleSubscribeClick(plan)} color="primary" variant="contained">
                          Subscribe
                        </Button>
                      </Stack>
                    
                      <Divider />

                      <List sx={{ p: 0, m: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0 } }}>
                        {plan?.features?.map((feature, featureIndex) => (
                          <ListItem key={featureIndex} alignItems="flex-start">
                            <ListItemIcon>
                              <CheckOutlined style={{ color: theme.palette.primary.main }}/>
                            </ListItemIcon>
                            <ListItemText primary={<Typography>{feature}</Typography>} />
                          </ListItem>
                        ))}
                      </List>

                    </Stack>

                  </Grid>
                </Grid>
                  
              </MainCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={planToSubscribe ? true : false}
        onClose={() => { setPlanToSubscribe(null); } }
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="xs"
      >
          <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogContent sx={{ mt: 2, my: 1 }}>
                  <Stack alignItems="center" spacing={3.5}>
                    <Avatar color="primary" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                      <ShoppingCartOutlined />
                    </Avatar>
                    <Stack spacing={2}>
                      <Typography variant="h4" align="center">
                        Subscribing to plan &apos;{planToSubscribe?.title}&apos;
                      </Typography>

                      {employers?.length > 0 ?
                        (<Stack spacing={1.25}>
                          <InfoWrapper tooltipText="subscription_company_tooltip">
                            <InputLabel htmlFor="employerId">Company</InputLabel>
                          </InfoWrapper>
                          <Select
                            fullWidth
                            id="employerId"
                            name="employerId"
                            displayEmpty
                            value={normalizeInputValue(values.employerId)}
                            onChange={(event) => { setFieldValue('employerId', event.target.value); }}
                          >
                            {employers?.map((employer) => (
                              <MenuItem key={employer?.id} value={employer?.id}>
                                {employer?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.employerId && errors.employerId && (
                            <FormHelperText error id="employer-id-helper">
                              {errors.employerId}
                            </FormHelperText>
                          )}
                        </Stack>)
                        :
                        (<Typography>No companies found.</Typography>)
                      }

                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="subscription_start_date_tooltip">
                          <InputLabel htmlFor="subscription-start-date">Start Date</InputLabel>
                        </InfoWrapper>
                        <DesktopDatePicker
                          value={normalizeNullableInputValue(values.startDate)}
                          inputFormat="yyyy-MM-dd"
                          onChange={(date) => {
                            setFieldValue('startDate', date);
                          }}
                          renderInput={(props) =>
                            <>
                              <TextField
                                id="subscription-start-date"
                                fullWidth
                                {...props}
                                placeholder="Start Date"
                                name="startDate"
                              />
                              {touched.startDate && errors.startDate && (
                                <FormHelperText error id="mission-start-date-helper">
                                  {errors.startDate}
                                </FormHelperText>
                              )}
                            </>
                          }
                        />
                      </Stack>

                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="subscription_duration_cycles_tooltip">
                          <InputLabel htmlFor="subscription-duration-cycles">Duration ({planToSubscribe?.rateType?.toLowerCase()})</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="subscription-duration-cycles"
                          type="number"
                          placeholder="Enter Subscription Duration"
                          value={normalizeInputValue(values.durationCycles)}
                          name="durationCycles"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.durationCycles && errors.durationCycles && (
                          <FormHelperText error id="subscription-duration-cycles-helper">
                            {errors.durationCycles}
                          </FormHelperText>
                        )}
                      </Stack>

                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                      <Button fullWidth type="submit" color="primary" variant="contained" disabled={isSubmitting} autoFocus>
                        Subscribe
                      </Button>
                      <Button fullWidth onClick={() => { setPlanToSubscribe(null); }} color="secondary" variant="outlined">
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </DialogContent>
              </Form>
            </LocalizationProvider>
          </FormikProvider>
      </Dialog>
    </>
  );
};

export default SubscriptionPage;
