import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';
import InvoicePdf from 'sections/billing/InvoicePdf';
import invoiceStatus from 'data/invoiceStatus';
import countries from 'data/countries';

// third-party
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { getCounterPartyLabel } from 'utils/stringUtils';

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
  Divider,
  Box
} from '@mui/material'

import { DatePicker } from '@mui/x-date-pickers';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const getInitialValues = (invoice) => {

  const result = {
    id: invoice?.id,
    status: invoice?.status,
    vatPercentageCompany: invoice?.debtor?.vatPercentage,
    vatPercentageTalent: invoice?.creditor?.vatPercentage,
    purchaseOrderNumber: invoice?.purchaseOrderNumber,
    dueDate: invoice?.dueDate,
    invoiceItems: invoice?.invoiceItems,
    
    creditorLegalEntityName: invoice?.creditor?.legalEntityName,
    creditorLegalRepresentativeName: invoice?.creditor?.fullName,
    creditorStreet: invoice?.creditor?.address?.street,
    creditorStreetNumber: invoice?.creditor?.address?.streetNumber,
    creditorCity: invoice?.creditor?.address?.city,
    creditorPostCode: invoice?.creditor?.address?.postCode,
    creditorCountry: invoice?.creditor?.address?.country,
    creditorVatNumber: invoice?.creditor?.vatNumber,
    creditorChamberOfCommerceIdentifier: invoice?.creditor?.chamberOfCommerceIdentifier,
    creditorBankAccountNumber: invoice?.creditor?.bankAccountNumber,

    debtorLegalEntityName: invoice?.debtor?.legalEntityName,
    debtorLegalRepresentativeName: invoice?.debtor?.fullName,
    debtorStreet: invoice?.debtor?.address?.street,
    debtorStreetNumber: invoice?.debtor?.address?.streetNumber,
    debtorCity: invoice?.debtor?.address?.city,
    debtorPostCode: invoice?.debtor?.address?.postCode,
    debtorCountry: invoice?.debtor?.address?.country,
    debtorVatNumber: invoice?.debtor?.vatNumber,
    debtorChamberOfCommerceIdentifier: invoice?.debtor?.chamberOfCommerceIdentifier,
    debtorBankAccountNumber: invoice?.debtor?.bankAccountNumber
  };

  return result;
}

const InvoiceDetails = ({ invoice, onInvoiceUpdated }) => {

  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async (pdfDocument, invoiceNumber) => {

    setIsDownloading(true);

    const fileName = `10xTeamBV_${invoiceNumber}`;

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const blob = await pdf((pdfDocument)).toBlob();
    var fileUrl = URL.createObjectURL(blob);
    window.open(fileUrl, '_blank');

    a.href = fileUrl;
    a.download = fileName;
    a.click();
    if (fileUrl)
      setTimeout(function () {
        URL.revokeObjectURL(fileUrl);
      }, 120000);
    setIsDownloading(false);
  };

  const InvoiceValidationSchema = Yup.object().shape({
    status: Yup.string().max(255).required('Invoice status is required').nullable(true),
    vatPercentageCompany: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required("VAT Percentage for company is required").nullable(true),
    vatPercentageTalent: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required("VAT Percentage for talent is required").nullable(true),
    purchaseOrderNumber: Yup.string().max(255).nullable(true),
    dueDate: Yup.date().nullable(true),
    invoiceItems: Yup.array(
      Yup.object({
        description: Yup.string().max(255).required('Description is required').nullable(true),
        totalAmount: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Total amount is required').nullable(true),
        quantity: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Quantity is required').nullable(true),
        unitPrice: Yup.number().transform((value) => Number.isNaN(value) ? null : value).required('Unit price is required').nullable(true)
      })
    ),

    creditorLegalEntityName: Yup.string().max(255).nullable(true),
    creditorLegalRepresentativeName: Yup.string().max(255).nullable(true),
    creditorStreet: Yup.string().max(255).nullable(true),
    creditorStreetNumber: Yup.string().max(255).nullable(true),
    creditorCity: Yup.string().max(255).nullable(true),
    creditorPostCode: Yup.string().max(255).nullable(true),
    creditorCountry: Yup.string().nullable(true),
    creditorVatNumber: Yup.string().max(255).nullable(true),
    creditorChamberOfCommerceIdentifier: Yup.string().max(255).nullable(true),
    creditorBankAccountNumber: Yup.string().max(255).nullable(true),

    debtorLegalEntityName: Yup.string().max(255).nullable(true),
    debtorLegalRepresentativeName: Yup.string().max(255).nullable(true),
    debtorStreet: Yup.string().max(255).nullable(true),
    debtorStreetNumber: Yup.string().max(255).nullable(true),
    debtorCity: Yup.string().max(255).nullable(true),
    debtorPostCode: Yup.string().max(255).nullable(true),
    debtorCountry: Yup.string().nullable(true),
    debtorVatNumber: Yup.string().max(255).nullable(true),
    debtorChamberOfCommerceIdentifier: Yup.string().max(255).nullable(true),
    debtorBankAccountNumber: Yup.string().max(255).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(invoice),
    validationSchema: InvoiceValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

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

  const { errors, handleChange, handleBlur, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  <Typography variant="subtitle2">{invoice?.id}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Invoice Number</Typography>
                  <Typography variant="subtitle2">{invoice?.invoiceNumber}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Invoice Date</Typography>
                  <Typography variant="subtitle2">{format(new Date(invoice?.invoiceDate), "yyyy-MM-dd")}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Invoice Type</Typography>
                  <Typography variant="subtitle2">{invoice?.invoiceType}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Reference Date</Typography>
                  <Typography variant="subtitle2">{format(new Date(invoice?.referenceDate), "yyyy-MM-dd")}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Period</Typography>
                  <Typography variant="subtitle2">{format(new Date(invoice?.startDate), "yyyy-MM-dd")} - {format(new Date(invoice?.endDate), "yyyy-MM-dd")}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Project Order Id</Typography>
                  <Typography variant="subtitle2">{invoice?.projectOrderId}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Total Amount (excl VAT)</Typography>
                  <Typography variant="subtitle2">€ {invoice?.totalAmountExcludingVat?.toFixed(2).replace(".", ",")}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Talent Service Order Id</Typography>
                  <Typography variant="subtitle2">{invoice?.serviceOrderIdContractor}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Vat Amount</Typography>
                  <Typography variant="subtitle2">€ {invoice?.vatAmount?.toFixed(2).replace(".", ",")}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Company Service Order Id</Typography>
                  <Typography variant="subtitle2">{invoice?.serviceOrderIdEmployer}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Total Amount (incl VAT)</Typography>
                  <Typography variant="subtitle2">€ {invoice?.totalAmountIncludingVat?.toFixed(2).replace(".", ",")}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Due Date</Typography>
                  <DatePicker
                    name="dueDate"
                    value={values.dueDate}
                    onChange={date => setFieldValue('dueDate', date)}
                    renderInput={(params) => <TextField {...params} />} />
                </Stack>
              </Grid>
              {invoice?.invoiceType === "Regular" ? (
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">VAT Percentage Company</Typography>
                    <TextField
                      fullWidth
                      id="invoice-vat-percentage-company"
                      placeholder="Enter VAT percentage for company"
                      value={normalizeInputValue(values.vatPercentageCompany)}
                      name="vatPercentageCompany"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.vatPercentageCompany && errors.vatPercentageCompany && (
                        <FormHelperText error id="invoice-vat-percentage-company-helper">
                          {errors.vatPercentageCompany}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
              ) :
                (
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1">VAT Percentage Talent</Typography>
                      <TextField
                        fullWidth
                        id="invoice-vat-percentage-talent"
                        placeholder="Enter VAT percentage for talent"
                        value={normalizeInputValue(values.vatPercentageTalent)}
                        name="vatPercentageTalent"
                        onBlur={handleBlur}
                        onChange={handleChange} />
                      {
                        touched.vatPercentageTalent && errors.vatPercentageTalent && (
                          <FormHelperText error id="invoice-vat-percentage-talent-helper">
                            {errors.vatPercentageTalent}
                          </FormHelperText>
                        )
                      }
                    </Stack>
                  </Grid>
                )
              }
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Purchase Order Number</Typography>
                  <TextField
                    fullWidth
                    id="invoice-purchase-order-number"
                    placeholder="Enter purchase order number"
                    value={normalizeInputValue(values.purchaseOrderNumber)}
                    name="purchaseOrderNumber"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.purchaseOrderNumber && errors.purchaseOrderNumber && (
                      <FormHelperText error id="invoice-purchase-order-number-helper">
                        {errors.purchaseOrderNumber}
                      </FormHelperText>
                    )
                  }
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
                      <Typography variant="h4"> Invoice Item {index + 1}</Typography>
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
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle1">Total amount</Typography>
                        <Typography variant="subtitle2">€ {invoiceItem?.totalAmount?.toFixed(2).replace(".", ",")}</Typography>
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

              <Fragment>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4">{getCounterPartyLabel(invoice?.invoiceType, 'Creditor')} Details</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Legal Entity Name</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-legal-entity-name"
                      placeholder="Enter legal entity name"
                      value={normalizeInputValue(values?.creditorLegalEntityName)}
                      name="creditorLegalEntityName"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorLegalEntityName && errors.creditorLegalEntityName && (
                        <FormHelperText error id="invoice-creditor-legal-entity-name-helper">
                          {errors.creditorLegalEntityName}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Legal Representative Name</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-legal-representative-name"
                      placeholder="Enter legal representative name"
                      value={normalizeInputValue(values?.creditorLegalRepresentativeName)}
                      name="creditorLegalRepresentativeName"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorLegalRepresentativeName && errors.creditorLegalRepresentativeName && (
                        <FormHelperText error id="invoice-creditor-legal-representative-name-helper">
                          {errors.creditorLegalRepresentativeName}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Street</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-street"
                      placeholder="Enter street"
                      value={normalizeInputValue(values?.creditorStreet)}
                      name="creditorStreet"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorStreet && errors.creditorStreet && (
                        <FormHelperText error id="invoice-creditor-street-helper">
                          {errors.creditorStreet}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Street Number</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-street-number"
                      placeholder="Enter street number"
                      value={normalizeInputValue(values?.creditorStreetNumber)}
                      name="creditorStreetNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorStreetNumber && errors.creditorStreetNumber && (
                        <FormHelperText error id="invoice-creditor-street-number-helper">
                          {errors.creditorStreetNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">City</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-city"
                      placeholder="Enter city"
                      value={normalizeInputValue(values?.creditorCity)}
                      name="creditorCity"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorCity && errors.creditorCity && (
                        <FormHelperText error id="invoice-creditor-city-helper">
                          {errors.creditorCity}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Post Code</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-post-code"
                      placeholder="Enter post code"
                      value={normalizeInputValue(values?.creditorPostCode)}
                      name="creditorPostCode"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorPostCode && errors.creditorPostCode && (
                        <FormHelperText error id="invoice-creditor-post-code-helper">
                          {errors.creditorPostCode}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Country</Typography>
                    
                    <Autocomplete
                      id="invoice-creditor-country"
                      fullWidth
                      value={values?.creditorCountry ? countries.find((item) => item.code === values?.creditorCountry) : null}
                      onBlur={handleBlur}
                      onChange={(event, newValue) => {
                        setFieldValue('creditorCountry', newValue === null ? '' : newValue.code);
                      }}
                      options={countries}
                      autoHighlight
                      isOptionEqualToValue={(option, value) => option.code === value?.code}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.code && (
                            <img
                              loading="lazy"
                              width="20"
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              alt=""
                            />
                          )}
                          {option.label}
                          {option.code && ` (${option.code})`}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Choose a country"
                          name="country"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password' // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {touched.creditorCountry && errors.creditorCountry && (
                      <FormHelperText error id="invoice-creditor-country-helper">
                        {errors.creditorCountry}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">VAT #</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-vat-number"
                      placeholder="Enter VAT #"
                      value={normalizeInputValue(values?.creditorVatNumber)}
                      name="creditorVatNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorVatNumber && errors.creditorVatNumber && (
                        <FormHelperText error id="invoice-creditor-vat-number-helper">
                          {errors.creditorVatNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">CoC #</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-coc-number"
                      placeholder="Enter CoC #"
                      value={normalizeInputValue(values?.creditorChamberOfCommerceIdentifier)}
                      name="creditorChamberOfCommerceIdentifier"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorChamberOfCommerceIdentifier && errors.creditorChamberOfCommerceIdentifier && (
                        <FormHelperText error id="invoice-creditor-coc-number-helper">
                          {errors.creditorChamberOfCommerceIdentifier}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Bank Account Number</Typography>
                    <TextField
                      fullWidth
                      id="invoice-creditor-bank-account-number"
                      placeholder="Enter bank account number"
                      value={normalizeInputValue(values?.creditorBankAccountNumber)}
                      name="creditorBankAccountNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.creditorBankAccountNumber && errors.creditorBankAccountNumber && (
                        <FormHelperText error id="invoice-creditor-bank-account-number-helper">
                          {errors.creditorBankAccountNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
              </Fragment>

              <Fragment>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4">{getCounterPartyLabel(invoice?.invoiceType, 'Debtor')} Details</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Legal Entity Name</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-legal-entity-name"
                      placeholder="Enter legal entity name"
                      value={normalizeInputValue(values?.debtorLegalEntityName)}
                      name="debtorLegalEntityName"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorLegalEntityName && errors.debtorLegalEntityName && (
                        <FormHelperText error id="invoice-debtor-legal-entity-name-helper">
                          {errors.debtorLegalEntityName}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Legal Representative Name</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-legal-representative-name"
                      placeholder="Enter legal representative name"
                      value={normalizeInputValue(values?.debtorLegalRepresentativeName)}
                      name="debtorLegalRepresentativeName"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorLegalRepresentativeName && errors.debtorLegalRepresentativeName && (
                        <FormHelperText error id="invoice-debtor-legal-representative-name-helper">
                          {errors.debtorLegalRepresentativeName}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Street</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-street"
                      placeholder="Enter street"
                      value={normalizeInputValue(values?.debtorStreet)}
                      name="debtorStreet"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorStreet && errors.debtorStreet && (
                        <FormHelperText error id="invoice-debtor-street-helper">
                          {errors.debtorStreet}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Street Number</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-street-number"
                      placeholder="Enter street number"
                      value={normalizeInputValue(values?.debtorStreetNumber)}
                      name="debtorStreetNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorStreetNumber && errors.debtorStreetNumber && (
                        <FormHelperText error id="invoice-debtor-street-number-helper">
                          {errors.debtorStreetNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">City</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-city"
                      placeholder="Enter city"
                      value={normalizeInputValue(values?.debtorCity)}
                      name="debtorCity"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorCity && errors.debtorCity && (
                        <FormHelperText error id="invoice-debtor-city-helper">
                          {errors.debtorCity}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Post Code</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-post-code"
                      placeholder="Enter post code"
                      value={normalizeInputValue(values?.debtorPostCode)}
                      name="debtorPostCode"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorPostCode && errors.debtorPostCode && (
                        <FormHelperText error id="invoice-debtor-post-code-helper">
                          {errors.debtorPostCode}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Country</Typography>
                    
                    <Autocomplete
                      id="invoice-debtor-country"
                      fullWidth
                      value={values?.debtorCountry ? countries.find((item) => item.code === values?.debtorCountry) : null}
                      onBlur={handleBlur}
                      onChange={(event, newValue) => {
                        setFieldValue('debtorCountry', newValue === null ? '' : newValue.code);
                      }}
                      options={countries}
                      autoHighlight
                      isOptionEqualToValue={(option, value) => option.code === value?.code}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.code && (
                            <img
                              loading="lazy"
                              width="20"
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              alt=""
                            />
                          )}
                          {option.label}
                          {option.code && ` (${option.code})`}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Choose a country"
                          name="country"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password' // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {touched.debtorCountry && errors.debtorCountry && (
                      <FormHelperText error id="invoice-debtor-country-helper">
                        {errors.debtorCountry}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">VAT #</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-vat-number"
                      placeholder="Enter VAT #"
                      value={normalizeInputValue(values?.debtorVatNumber)}
                      name="debtorVatNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorVatNumber && errors.debtorVatNumber && (
                        <FormHelperText error id="invoice-debtor-vat-number-helper">
                          {errors.debtorVatNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">CoC #</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-coc-number"
                      placeholder="Enter CoC #"
                      value={normalizeInputValue(values?.debtorChamberOfCommerceIdentifier)}
                      name="debtorChamberOfCommerceIdentifier"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorChamberOfCommerceIdentifier && errors.debtorChamberOfCommerceIdentifier && (
                        <FormHelperText error id="invoice-debtor-coc-number-helper">
                          {errors.debtorChamberOfCommerceIdentifier}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Bank Account Number</Typography>
                    <TextField
                      fullWidth
                      id="invoice-debtor-bank-account-number"
                      placeholder="Enter bank account number"
                      value={normalizeInputValue(values?.debtorBankAccountNumber)}
                      name="debtorBankAccountNumber"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.debtorBankAccountNumber && errors.debtorBankAccountNumber && (
                        <FormHelperText error id="invoice-debtor-bank-account-number-helper">
                          {errors.debtorBankAccountNumber}
                        </FormHelperText>
                      )
                    }
                  </Stack>
                </Grid>
              </Fragment>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    color="primary"
                    variant="outlined"
                    size="medium"
                    onClick={async () => {
                      await handleDownloadPdf(<InvoicePdf invoice={invoice} />, invoice.invoiceNumber);
                    }}>
                    {isDownloading === true ? <CircularProgress size={20} /> : "Download Invoice"}
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
    </LocalizationProvider>
  );
};

InvoiceDetails.propTypes = {
  invoice: PropTypes.object
};

export default InvoiceDetails;