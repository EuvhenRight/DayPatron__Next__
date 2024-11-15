import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, prepareApiBody, normalizeNullableInputValue } from 'utils/stringUtils';
import { addMonths, format } from 'date-fns';

import { TextField, FormHelperText, Button, Grid, InputLabel, Stack } from '@mui/material';

import InfoWrapper from 'components/InfoWrapper';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

const getInitialValues = (order) => {
  const result = {
    id: order?.id,

    duration: order?.duration,
    startDate: order?.startDate ? new Date(order?.startDate) : null,
    endDate: order?.endDate ? new Date(order?.endDate) : null
  };

  return result;
};

const UpdateSubscriptionOrderTerms = ({order}) => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();

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
          endDate: values.endDate
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
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                    if(date && values?.duration)
                      setFieldValue('endDate', addMonths(date, values?.duration));
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
                  onChange={(e) => {
                    handleChange(e);
                    if(values?.startDate && e.target.value)
                      setFieldValue('endDate', addMonths(values?.startDate, e.target.value));
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

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default UpdateSubscriptionOrderTerms;
