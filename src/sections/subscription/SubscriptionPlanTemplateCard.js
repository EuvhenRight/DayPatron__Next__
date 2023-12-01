import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';

// third-party
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

// material-ui
import {
  Grid,
  Stack,
  TextField,
  FormHelperText,
  Divider,
  InputLabel
} from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const getInitialValues = (invoice) => {

  const result = {
    id: invoice?.id,
    status: invoice?.status,
    vatPercentageCompany: invoice?.debtor?.vatPercentage,
    vatPercentageTalent: invoice?.creditor?.vatPercentage,
    purchaseOrderNumber: invoice?.purchaseOrderNumber,
    dueDate: invoice?.dueDate
  };

  return result;
}

const SubscriptionPlanTemplateCard = ({ template, onTemplateUpdated }) => {

  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();

  const InvoiceValidationSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Required').nullable(true),
    rateAmount: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required("Required").nullable(true),
    minimumDurationCycles: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required("Required").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(invoice),
    validationSchema: InvoiceValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        if (invoice) {
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscription-plans/templates',
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

          dispatch(
            openSnackbar({
              open: true,
              message: 'Invoice updated.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

          onInvoiceUpdated();

        }
        setSubmitting(false);

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleChange, handleBlur, touched, handleSubmit, values } = formik;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <MainCard>
              <Grid container spacing={2.25}>
                <Grid item xs={12}>
                  <List sx={{ width: 1, p: 0 }}>
                    <ListItem disablePadding>
                      <ListItemText className="list-card-title" primary={
                        <Stack spacing={1.25}>
                          <InputLabel htmlFor="subscription-plan-template-title">Title</InputLabel>
                          <TextField
                            fullWidth
                            id="subscription-plan-template-title"
                            type="number"
                            inputProps={{ min: 0, max: 1000000 }}
                            placeholder="Enter rate amount"
                            value={normalizeInputValue(values.title)}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.title && errors.title && (
                            <FormHelperText error id="subscription-plan-template-title-helper">
                              {errors.title}
                            </FormHelperText>
                          )}
                        </Stack>
                      } />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="subscription-plan-template-rate-amount">Rate Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="subscription-plan-template-rate-amount"
                      type="number"
                      inputProps={{ min: 0, max: 1000000 }}
                      placeholder="Enter rate amount"
                      value={normalizeInputValue(values.rateAmount)}
                      name="rateAmount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.rateAmount && errors.rateAmount && (
                      <FormHelperText error id="subscription-plan-template-rate-amount-helper">
                        {errors.rateAmount}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="subscription-plan-template-minimum-duration-cycles">Minimum Duration Cycles</InputLabel>
                    <TextField
                      fullWidth
                      id="subscription-plan-template-minimum-duration-cycles"
                      type="number"
                      inputProps={{ min: 0, max: 1000000 }}
                      placeholder="Enter minimum duration cycles"
                      value={normalizeInputValue(values.minimumDurationCycles)}
                      name="minimumDurationCycles"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.minimumDurationCycles && errors.minimumDurationCycles && (
                      <FormHelperText error id="subscription-plan-template-minimum-duration-cycles-helper">
                        {errors.minimumDurationCycles}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              
            </MainCard>
        </Form>
      </FormikProvider>
    </LocalizationProvider>
  );
};

SubscriptionPlanTemplateCard.propTypes = {
  template: PropTypes.object
};

export default SubscriptionPlanTemplateCard;