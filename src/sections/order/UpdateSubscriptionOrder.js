import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Rte from 'components/Rte';
import InfoWrapper from 'components/InfoWrapper';

// material-ui
import {
  FormHelperText,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  Typography
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

// constant
const getInitialValues = (subscriptionOrder) => {
  const result = {
    id: subscriptionOrder?.id,
    contractorServiceOrderDescription: subscriptionOrder?.contractorServiceOrder?.description,
    employerServiceOrderDescription: subscriptionOrder?.employerServiceOrder?.description
  };

  return result;
};

// ==============================|| SUBSCRIPTION ORDER ADD / EDIT / DELETE ||============================== //

const UpdateSubscriptionOrder = ({ subscriptionOrderId }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscriptionOrder, setSubscriptionOrder] = useState(null);

  const getSubscriptionOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + subscriptionOrderId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const bindSubscriptionOrder = async () => {
    let subscriptionOrderResponse = await getSubscriptionOrder();
    setSubscriptionOrder(subscriptionOrderResponse?.order);
  };

  useEffect(() => {
    (async () => {
      if (subscriptionOrderId) {
        await bindSubscriptionOrder();
      }
    })();
  }, [subscriptionOrderId, keycloak?.idToken]);

  const SubscriptionOrderSchema = Yup.object().shape({
    contractorServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    employerServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(subscriptionOrder),
    validationSchema: SubscriptionOrderSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscriptions/orders/' + subscriptionOrderId,
          {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken,
              'Content-Type': 'application/json'
            },
            body: prepareApiBody(body)
          }
        );

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

        navigate('/orders');

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

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthrozied</Typography>

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Update Subscription Order</DialogTitle>
          <Divider />

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Typography variant="h5">Company Service Order</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="subscription_order_employer_service_order_description_tooltip">
                    <InputLabel htmlFor="subscription-order-employer-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <Rte
                    id="subscription-order-employer-service-order-description"
                    value={normalizeInputValue(values.employerServiceOrderDescription)}
                    onChange={(e) => setFieldValue('employerServiceOrderDescription', e)}
                  />
                  {touched.employerServiceOrderDescription && errors.employerServiceOrderDescription && (
                    <FormHelperText error id="subscription-order-employer-service-order-description-helper">
                      {errors.employerServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Talent Service Order</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="subscription_order_contractor_service_order_description_tooltip">
                    <InputLabel htmlFor="subscription-order-contractor-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <Rte
                    id="subscription-order-contractor-service-order-description"
                    value={normalizeInputValue(values.contractorServiceOrderDescription)}
                    onChange={(e) => setFieldValue('contractorServiceOrderDescription', e)}
                  />
                  {touched.contractorServiceOrderDescription && errors.contractorServiceOrderDescription && (
                    <FormHelperText error id="subscription-order-contractor-service-order-description-helper">
                      {errors.contractorServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button color="error" onClick={() => { navigate('/orders'); }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Update
              </Button>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

UpdateSubscriptionOrder.propTypes = {
  subscriptionOrderId: PropTypes.any
};

export default UpdateSubscriptionOrder;
