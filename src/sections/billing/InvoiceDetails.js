import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';
import InvoicePdf from 'sections/billing/InvoicePdf';
import invoiceStatus from 'data/invoiceStatus';

// third-party
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

// material-ui
import {
  Typography,
  Grid,
  Stack,
  Button,
  TextField,
  Autocomplete,
  FormHelperText,
  Divider
} from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress';

const getInitialValues = (invoice) => {

  const result = {
    id: invoice?.id,
    status: invoice?.status,
    description: invoice?.invoiceItem.description,
    quantity: invoice?.invoiceItem.quantity,
    totalAmount: invoice?.invoiceItem.totalPrice
  };

  return result;
}

const InvoiceDetails = ({ invoice }) => {

  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async (pdfDocument) => {
    setIsDownloading(true);
    const blob = await pdf((pdfDocument)).toBlob();
    var fileUrl = URL.createObjectURL(blob);
    window.open(fileUrl, '_blank');

    if (fileUrl)
      setTimeout(function () {
        URL.revokeObjectURL(fileUrl);
      }, 120000);
    setIsDownloading(false);
  };

  const InvoiceSchema = Yup.object().shape({
    status: Yup.string().max(255).required('Invoice status is required').nullable(true),
    description: Yup.string().max(255).required('Invoice item description is required').nullable(true),
    totalAmount: Yup.number('Invoice item total amount is required'),
    quantity: Yup.string().max(255).required('Invoice item effort/quantity is required').nullable(true),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(invoice),
    validationSchema: InvoiceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        body.invoiceStatus = values?.status;

        if (invoice) {
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/invoices/' + invoice.id,
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

          navigate('/billinginfo/' + invoice.billingInfoId);

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
        }
        setSubmitting(false);

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3">Invoice</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Invoice Id</Typography>
                <Typography variant="subtitle2">{invoice.id}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Invoice Number</Typography>
                <Typography variant="subtitle2">{invoice.invoiceNumber}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Invoice Date</Typography>
                <Typography variant="subtitle2">{format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Invoice Type</Typography>
                <Typography variant="subtitle2">{invoice.invoiceType}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Reference Date</Typography>
                <Typography variant="subtitle2">{format(new Date(invoice.referenceDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Due Date</Typography>
                <Typography variant="subtitle2">{invoice.dueDate && format(new Date(invoice.dueDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Start Date</Typography>
                <Typography variant="subtitle2">{format(new Date(invoice.startDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">End Date</Typography>
                <Typography variant="subtitle2">{format(new Date(invoice.endDate), "yyyy-MM-dd")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total Amount Excluding VAT</Typography>
                <Typography variant="subtitle2">{invoice.totalAmountExcludingVat}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Vat Amount</Typography>
                <Typography variant="subtitle2">{invoice.vatAmount}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total Amount Including VAT</Typography>
                <Typography variant="subtitle2">{invoice.totalAmountIncludingVat}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Project Order Id</Typography>
                <Typography variant="subtitle2">{invoice.projectOrderId}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Talent Service Order Id</Typography>
                <Typography variant="subtitle2">{invoice.serviceOrderIdContractor}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Company Service Order Id</Typography>
                <Typography variant="subtitle2">{invoice.serviceOrderIdEmployer}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Status</Typography>
                <Autocomplete
                  id="invoice-status"
                  options={invoiceStatus}
                  value={values?.status ? invoiceStatus.filter((item) => item.code === values?.status)[0] : null}
                  onBlur={handleBlur}
                  getOptionLabel={(option) => option?.label}
                  isOptionEqualToValue={(option, value) => option.code === value?.code}
                  onChange={(event, newValue) => {
                    setFieldValue('status', newValue === null ? '' : newValue.code);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select invoice status"
                      name="status"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password'
                      }} />
                  )} />
                {touched.status && errors.status && (
                  <FormHelperText error id="invoice-status-helper">
                    {errors.status}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4"> Invoice item</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Effort</Typography>
                <TextField
                  fullWidth
                  id="invoice-item-quantity"
                  placeholder="Enter effort/quantity for invoice item"
                  value={normalizeInputValue(values.quantity)}
                  name="quantity"
                  onBlur={handleBlur}
                  onChange={handleChange} />
                {touched.quantity && errors.quantity && (
                  <FormHelperText error id="invoice-item-quantity-helper">
                    {errors.quantity}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Rate type</Typography>
                <Typography variant="subtitle2">{invoice.invoiceItem.rateType}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Unit price</Typography>
                <Typography variant="subtitle2">{invoice.invoiceItem.unitPrice}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total amount</Typography>
                <TextField
                  fullWidth
                  id="invoice-item-totalAmount"
                  placeholder="Enter total amount for invoice item"
                  value={normalizeInputValue(values.totalAmount)}
                  name="totalAmount"
                  onBlur={handleBlur}
                  onChange={handleChange} />
                {touched.totalAmount && errors.totalAmount && (
                  <FormHelperText error id="invoice-item-total-amount-helper">
                    {errors.totalAmount}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Description</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  id="invoice-item-description"
                  placeholder="Enter description for invoice item"
                  value={normalizeInputValue(values.description)}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange} />
                {touched.description && errors.description && (
                  <FormHelperText error id="invoice-item-description-helper">
                    {errors.description}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={async () => {
                    await handleDownloadPdf(<InvoicePdf invoice={invoice} />);
                  }}>
                  Download Invoice
                  {isDownloading && <CircularProgress size={20} />}
                </Button>
                <Button type="submit" disabled={isSubmitting} color="primary" variant="contained">
                  Update
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </FormikProvider>
  );
};

InvoiceDetails.propTypes = {
  invoice: PropTypes.object
};

export default InvoiceDetails;