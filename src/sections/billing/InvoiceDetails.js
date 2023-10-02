import { Fragment, useState } from 'react';
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
    invoiceItems: invoice?.invoiceItems
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

  const InvoiceValidationSchema = Yup.object().shape({
    status: Yup.string().max(255).required('Invoice status is required').nullable(true),
    invoiceItems: Yup.array(
      Yup.object({
        description: Yup.string().max(255).required('Description is required').nullable(true),
        totalAmount: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Total amount is required').nullable(true),
        quantity: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Quantity is required').nullable(true),
        unitPrice: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Unit price is required').nullable(true)
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(invoice),
    validationSchema: InvoiceValidationSchema,
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

  const { errors, handleChange, handleBlur, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

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
                <Typography variant="subtitle2">€ {invoice.totalAmountExcludingVat.toFixed(2).replace(".", ",")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Vat Amount</Typography>
                <Typography variant="subtitle2">€ {invoice.vatAmount.toFixed(2).replace(".", ",")}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Total Amount Including VAT</Typography>
                <Typography variant="subtitle2">€ {invoice.totalAmountIncludingVat.toFixed(2).replace(".", ",")}</Typography>
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
            {invoice.invoiceItems.map((invoiceItem, index) => {
              return (
                <Fragment key={index}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4"> Invoice item {index + 1}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">Rate type</Typography>
                      <Typography variant="subtitle2">{invoiceItem.rateType}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">Quantity</Typography>
                      <TextField
                        fullWidth
                        id={`invoice-item-quantity${index}`}
                        placeholder="Enter quantity for invoice item"
                        value={normalizeInputValue(values.invoiceItems[index].quantity)}
                        name={`quantity${index}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(`invoiceItems.${index}.quantity`, e.target.value);
                        }} />
                      {touched.invoiceItems?.[index]?.quantity && errors.invoiceItems?.[index]?.quantity && (
                        <FormHelperText error id={`invoice-item-quantity-helper${index}`}>
                          {errors.invoiceItems?.[index]?.quantity}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">Unit Price</Typography>
                      <TextField
                        fullWidth
                        id={`invoice-item-unitPrice${index}`}
                        placeholder="Enter unit price for invoice item"
                        value={normalizeInputValue(values.invoiceItems[index].unitPrice)}
                        name={`unitPrice${index}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(`invoiceItems.${index}.unitPrice`, e.target.value);
                        }} />
                      {touched.invoiceItems?.[index]?.unitPrice && errors.invoiceItems?.[index]?.unitPrice && (
                        <FormHelperText error id={`invoice-item-unit-price-helper${index}`}>
                          {errors.invoiceItems?.[index]?.unitPrice}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">Total amount</Typography>
                      <TextField
                        fullWidth
                        id={`invoice-item-totalAmount${index}`}
                        placeholder="Enter total amount for invoice item"
                        value={normalizeInputValue(values.invoiceItems[index].totalAmount)}
                        name={`totalAmount${index}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(`invoiceItems.${index}.totalAmount`, e.target.value);
                        }} />
                      {touched.invoiceItems?.[index]?.totalAmount && errors.invoiceItems?.[index]?.totalAmount && (
                        <FormHelperText error id={`invoice-item-total-amount-helper${index}`}>
                          {errors.invoiceItems?.[index]?.totalAmount}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">Description</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        id={`invoice-item-description${index}`}
                        placeholder="Enter description for invoice item"
                        value={normalizeInputValue(values.invoiceItems[index].description)}
                        name={`description${index}`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(`invoiceItems.${index}.description`, e.target.value);
                        }} />
                      {touched.invoiceItems?.[index]?.description && errors.invoiceItems?.[index]?.description && (
                        <FormHelperText error id={`invoice-item-description-helper${index}`}>
                          {errors.invoiceItems?.[index]?.description}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Fragment>
              );
            })}

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