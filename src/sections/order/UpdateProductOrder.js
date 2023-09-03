import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
const getInitialValues = (productOrder) => {
  const result = {
    id: productOrder?.id,
    contractorServiceOrderDescription: productOrder?.contractorServiceOrder?.description,
    employerServiceOrderDescription: productOrder?.employerServiceOrder?.description
  };

  return result;
};

// ==============================|| PRODUCT ORDER ADD / EDIT / DELETE ||============================== //

const UpdateProductOrder = ({ productOrderId }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [productOrder, setProductOrder] = useState(null);

  const getProductOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/' + productOrderId,
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

  const bindProductOrder = async () => {
    let productOrderResponse = await getProductOrder();
    setProductOrder(productOrderResponse?.order);
  };

  useEffect(() => {
    (async () => {
      if (productOrderId) {
        await bindProductOrder();
      }
    })();
  }, [productOrderId]);

  const ProductSchema = Yup.object().shape({
    contractorServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    employerServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(productOrder),
    validationSchema: ProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/orders/' + productOrderId,
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

        navigate('/orders/my');

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
          <DialogTitle>Update Solution Order</DialogTitle>
          <Divider />

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Typography variant="h5">Company Service Order</Typography>
              </Grid>
              <Grid item xs={12}
                sx={{
                  '& .quill': {
                    borderRadius: '4px',
                    '& .ql-toolbar': {
                      bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                      borderColor: theme.palette.divider,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px'
                    },
                    '& .ql-container': {
                      borderColor: `${theme.palette.divider} !important`,
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      '& .ql-editor': {
                        minHeight: 135
                      }
                    }
                  }
                }}
              >
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="product_order_employer_service_order_description_tooltip">
                    <InputLabel htmlFor="product-order-employer-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="product-order-employer-service-order-description"
                    value={normalizeInputValue(values.employerServiceOrderDescription)}
                    onChange={(e) => setFieldValue('employerServiceOrderDescription', e)}
                  />
                  {touched.employerServiceOrderDescription && errors.employerServiceOrderDescription && (
                    <FormHelperText error id="product-order-employer-service-order-description-helper">
                      {errors.employerServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Talent Service Order</Typography>
              </Grid>
              <Grid item xs={12}
                sx={{
                  '& .quill': {
                    borderRadius: '4px',
                    '& .ql-toolbar': {
                      bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                      borderColor: theme.palette.divider,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px'
                    },
                    '& .ql-container': {
                      borderColor: `${theme.palette.divider} !important`,
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      '& .ql-editor': {
                        minHeight: 135
                      }
                    }
                  }
                }}
              >
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="product_order_contractor_service_order_description_tooltip">
                    <InputLabel htmlFor="product-order-contractor-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="product-order-contractor-service-order-description"
                    value={normalizeInputValue(values.contractorServiceOrderDescription)}
                    onChange={(e) => setFieldValue('contractorServiceOrderDescription', e)}
                  />
                  {touched.contractorServiceOrderDescription && errors.contractorServiceOrderDescription && (
                    <FormHelperText error id="product-order-contractor-service-order-description-helper">
                      {errors.contractorServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button color="error" onClick={() => { navigate('/orders/my'); }}>
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

UpdateProductOrder.propTypes = {
  productId: PropTypes.any
};

export default UpdateProductOrder;
