import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainCard from 'components/MainCard';
import {
  Link,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  FormHelperText,
  InputLabel
} from '@mui/material';

import SanitizedHTML from 'react-sanitized-html';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { openSnackbar } from 'store/reducers/snackbar';
import countries from 'data/countries';
import InfoWrapper from 'components/InfoWrapper';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { normalizeInputValue, prepareApiBody, normalizeNullableInputValue } from 'utils/stringUtils';
import { addMonths, format } from 'date-fns';

const getInitialValues = (order) => {
  const result = {
    id: order?.id,

    duration: order?.duration,
    startDate: order?.startDate ? new Date(order?.startDate) : null,
    endDate: order?.endDate ? new Date(order?.endDate) : null
  };

  return result;
};

const ContractorSubscriptionServiceOrder = ({ orderId, isEditable, hideTitle }) => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const admin = useSelector(state => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [hasAcceptedProjectOrderTerms, setHasAcceptedProjectOrderTerms] = useState(null);

  useEffect(() => {
    (async () => {
      if(orderId)
        await bindOrder();
    })();
  }, [orderId, keycloak?.idToken]);

  const bindOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + orderId, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });

      let json = await response.json();

      setOrder(json.order);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveConfirmClick = async () => {
    let response = await fetch(
      process.env.REACT_APP_JOBMARKET_API_BASE_URL +
        '/subscriptions/orders/' +
        order.id +
        '/contractor-service-orders/contractor-approvals',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed approving.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );

      return;
    }

    dispatch(
      openSnackbar({
        open: true,
        message: 'Approved.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );

    navigate('/orders');
  };

  const handleProjectOrderTermsClick = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/project-order-terms', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });

      let file = await response.blob();
      var fileUrl = URL.createObjectURL(file);

      if (fileUrl)
        setTimeout(function () {
          URL.revokeObjectURL(fileUrl);
        }, 300000);

      window.open(fileUrl, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  const getIsServiceOrderApprovable = (orderArg, roleArg) => {
    if (roleArg !== 'admin' && !hasAcceptedProjectOrderTerms) {
      return false;
    }

    if(isEditable) return true;
    else if (roleArg === 'admin') return orderArg?.contractorServiceOrder?.adminStatus === 'Pending';
    else if (roleArg === 'contractor') return orderArg?.contractorServiceOrder?.contractorStatus === 'Pending';

    return false;
  };

  const getServiceOrderContent = (orderParam, role) => {
    if (!orderParam)
      return;

    return <>
      <Grid item xs={12}>
        <Typography>ID: {orderParam?.contractorServiceOrder?.id}</Typography>
      </Grid>
      <Grid item xs={6}>
        <MainCard>
          <Stack>
            <Typography>{orderParam?.contractorLegalEntityName}</Typography>
            <Typography>{orderParam?.contractorLegalEntityRepresentativeName}</Typography>
            <Typography>{orderParam?.contractorStreet} {orderParam?.contractorStreetNumber}</Typography>
            <Typography>{orderParam?.contractorPostCode} {orderParam?.contractorCity}</Typography>
            <Typography>{countries.find(x => x.code === orderParam?.contractorCountry)?.label}</Typography>
            <Typography>&nbsp;</Typography>
            <Typography>VAT#: {orderParam?.contractorVatNumber}</Typography>
            <Typography>CoC#: {orderParam?.contractorChamberOfCommerceIdentifier}</Typography>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={6}>
        <MainCard>
          <Stack>
            <Typography>{orderParam?.adminLegalEntityName}</Typography>
            <Typography>{orderParam?.adminLegalEntityRepresentativeName}</Typography>
            <Typography>{orderParam?.adminStreet} {orderParam?.adminStreetNumber}</Typography>
            <Typography>{orderParam?.adminPostCode} {orderParam?.adminCity}</Typography>
            <Typography>{countries.find(x => x.code === orderParam?.adminCountry)?.label}</Typography>
            <Typography>&nbsp;</Typography>
            <Typography>VAT#: {orderParam?.adminVatNumber}</Typography>
            <Typography>CoC#: {orderParam?.adminChamberOfCommerceIdentifier}</Typography>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <List sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
            <ListItem>
              <ListItemText>
                10x-er
              </ListItemText>
              <ListItemSecondaryAction>
                {orderParam?.contractorName}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText>
                Plan
              </ListItemText>
              <ListItemSecondaryAction>
                {orderParam?.subscriptionPlanTitle}
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText>
                <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                &euro;{orderParam?.contractorServiceOrder?.rateAmount}
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Purchase Terms</Typography>
        <SanitizedHTML html={orderParam?.contractorServiceOrder?.description} />
      </Grid>
      {keycloak.tokenParsed.roles.includes('contractor') && role === 'contractor' &&
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={hasAcceptedProjectOrderTerms} onChange={(event) => setHasAcceptedProjectOrderTerms(event.target.checked)} color="primary" />}
            label={<p>I have read and agree to the <Link href="#" onClick={handleProjectOrderTermsClick}>Project Contract Terms &amp; Conditions</Link> that are applicable to this Service Order.</p>}
          />
        </Grid>
      }
    </>;
  };

  const ValidationSchema = Yup.object().shape({
    duration: Yup.number()
      .test('is-int', 'Invalid duration', (value) => {
        if (!value) return true;
        return (value + '').match(/^\d*$/);
      })
      .max(0)
      .max(999999)
      .nullable(true),
    startDate: Yup.string().required('Required').nullable(true),
    endDate: Yup.string().required('Required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(order),
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = {
          duration: values.duration,
          startDate: values.startDate,
          endDate: values.endDate,
          sourceContractorId: admin?.workAsAdmin ? null : personalInformation?.id
        };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + order.id + '/terms', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody(body)
        });

        if (!response.ok) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Update failed.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: false
            })
          );
          setSubmitting(false);
          return;
        }

        dispatch(
          openSnackbar({
            open: true,
            message: 'Order updated.',
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
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <MainCard title={hideTitle ? null : 'Company Subscription Service Order'}>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {isEditable && (
                <>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.25}>
                      <InfoWrapper tooltipText="subscription_order_terms_start_date_tooltip">
                        <InputLabel htmlFor="startDate">Start Date</InputLabel>
                      </InfoWrapper>
                      <DesktopDatePicker
                        value={normalizeNullableInputValue(values.startDate)}
                        inputFormat="yyyy-MM-dd"
                        onChange={(date) => {
                          setFieldValue('startDate', date);
                          if (date && values?.duration) setFieldValue('endDate', addMonths(date, values?.duration));
                          setOrder((prevOrder) => {
                            let result = { ...prevOrder };
                            result.contractorServiceOrder.startDate = date;
                            return result;
                          });
                        }}
                        renderInput={(props) => (
                          <>
                            <TextField id="startDate" fullWidth {...props} placeholder="Start Date" name="startDate" />
                            {touched.startDate && errors.startDate && (
                              <FormHelperText error id="order-start-date-helper">
                                {errors.startDate}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.25}>
                      <InfoWrapper tooltipText="subscription_order_terms_duration_tooltip">
                        <InputLabel htmlFor="duration">Duration (monthly)</InputLabel>
                      </InfoWrapper>
                      <TextField
                        fullWidth
                        id="duration"
                        placeholder="Enter effort"
                        value={normalizeInputValue(values.duration)}
                        name="duration"
                        onBlur={handleBlur}
                        type="number"
                        max="120"
                        onChange={(e) => {
                          if(e.target.value > 120)
                            return;
                          handleChange(e);
                          if (values?.startDate && e.target.value) setFieldValue('endDate', addMonths(values?.startDate, e.target.value));
                          setOrder((prevOrder) => {
                            let result = { ...prevOrder };
                            result.contractorServiceOrder.duration = e.target.value;
                            return result;
                          });
                        }}
                      />
                      {touched.duration && errors.duration && (
                        <FormHelperText error id="order-duration-helper">
                          {errors.duration}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.25}>
                      <InfoWrapper tooltipText="subscription_order_terms_end_date_tooltip">
                        <InputLabel htmlFor="endDate">End Date</InputLabel>
                      </InfoWrapper>
                      <TextField disabled={true} fullWidth value={values?.endDate ? format(new Date(values?.endDate), 'yyyy-MM-dd') : ''} />
                    </Stack>
                  </Grid>
                </>
              )}

              {getServiceOrderContent(order, 'contractor')}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      navigate('/orders');
                    }}
                    color="secondary"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  {isEditable ? (
                    <Button
                      disabled={!getIsServiceOrderApprovable(order, 'contractor') || isSubmitting}
                      fullWidth
                      color="primary"
                      variant="contained"
                      type="submit"
                      autoFocus
                    >
                      Save + Approve
                    </Button>
                  ) : (
                    <Button
                      disabled={!getIsServiceOrderApprovable(order, 'contractor')}
                      fullWidth
                      color="primary"
                      variant="contained"
                      onClick={handleApproveConfirmClick}
                      autoFocus
                    >
                      Approve
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </MainCard>
  );
};

export default ContractorSubscriptionServiceOrder;
