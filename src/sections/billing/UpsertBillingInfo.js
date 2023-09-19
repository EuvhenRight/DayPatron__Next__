import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//material-ui
import {
  Typography,
  Grid,
  Stack,
  Button,
  InputLabel,
  TextField,
  Autocomplete
} from '@mui/material'

// assets
import { useKeycloak } from '@react-keycloak/web';
import { prepareApiBody } from 'utils/stringUtils';

// import { normalizeInputValue } from 'utils/stringUtils';

// project import
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';
import invoiceStatus from 'data/invoiceStatus';
import InvoicePdfCard from 'sections/billing/InvoicePdfCard';

// third-party
import { useFormik, Form, FormikProvider } from 'formik';
import { pdf } from '@react-pdf/renderer';

const getInitialValues = (currentInvoice) => {

  const updatedInvoice = {
    status: null
  };

  if (currentInvoice) {
    var result = _.merge({}, updatedInvoice, currentInvoice);
    return result;
  }
};

// ==============================|| BILLINGINFO VIEW / EDIT ||============================== //

const UpsertBillingInfo = ({ billingInfoId }) => {
  const { keycloak } = useKeycloak();
  const [billingInfo, setBillingInfo] = useState([]);

  const bindBillingInfo = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/billing/' + billingInfoId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          }
        }
      );
      let json = await response.json();

      setBillingInfo(json.billingInfo);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      if (billingInfoId) {
        await bindBillingInfo();
      }
    })();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(billingInfo.invoice),
    // validationSchema:
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (billingInfo.invoice[0]) { //todo
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/invoices/' + billingInfo.invoice[0].id,
            {
              method: 'PUT',
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
                message: 'update failed.',
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

          Navigate('/billinginfo/{billingInfo.id}');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Saved.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  const handleDownloadPdf = async (pdfDocument) => {
    const blob = await pdf((pdfDocument)).toBlob();
    var fileUrl = URL.createObjectURL(blob);
    window.open(fileUrl, '_blank');

    if (fileUrl)
      setTimeout(function () {
        URL.revokeObjectURL(fileUrl);
      }, 120000);
  }

  const { handleSubmit, isSubmitting, setFieldValue, values } = formik;
  // const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3">Billing Info</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Id</Typography>
                    <Typography variant="subtitle2">{billingInfo.id}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Start Date</Typography>
                    <Typography variant="subtitle2">{billingInfo.startDate}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">End Date</Typography>
                    <Typography variant="subtitle2">{billingInfo.endDate}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Name</Typography>
                    <Typography variant="subtitle2">{billingInfo.itemName}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Status</Typography>
                    <Typography variant="subtitle2">{billingInfo.billingStatus}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Creation Date</Typography>
                    <Typography variant="subtitle2">{billingInfo.createdAtUtc}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Mission Order Id</Typography>
                    <Typography variant="subtitle2">{billingInfo.missionOrderId}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Employer Name</Typography>
                    <Typography variant="subtitle2">{billingInfo.employerName}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Contractor Name</Typography>
                    <Typography variant="subtitle2">{billingInfo.contractorName}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Product Order Id</Typography>
                    <Typography variant="subtitle2">{billingInfo.productOrderId}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Total Amount Employer</Typography>
                    <Typography variant="subtitle2">{billingInfo.totalAmountEmployer}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Total Amount Talent</Typography>
                    <Typography variant="subtitle2">{billingInfo.totalAmountContractor}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Gross Margin 10x</Typography>
                    <Typography variant="subtitle2">{billingInfo.grossMargin10x}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {billingInfo.invoices?.map((invoice, index) => {
            return (
              <Grid key={index} item xs={12} md={6}>
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
                        <Typography variant="subtitle2">{invoice.invoiceDate}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>Status</InputLabel>
                        <Autocomplete
                          // disablePortal
                          id="invoice-status"
                          options={invoiceStatus}
                          value={values?.status ? invoiceStatus.find((item) => item.code === values?.status)[0] : null}
                          // value={values?.invoiceStatus ? invoiceStatus.find((item) => item.code === values?.invoiceStatus) : null}
                          // onBlur={handleBlur}
                          getOptionDisabled={(option) => option?.label}
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
                              }}
                            />
                          )}
                        />

                        {/* <Typography variant="subtitle1">Status</Typography>
                    <Typography variant="subtitle2">{invoice.status}</Typography> */}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle1">Start Date</Typography>
                        <Typography variant="subtitle2">{invoice.startDate}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle1">End Date</Typography>
                        <Typography variant="subtitle2">{invoice.endDate}</Typography>
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
                        <Typography variant="subtitle1">Total Amount Including VAT</Typography>
                        <Typography variant="subtitle2">{invoice.totalAmountIncludingVat}</Typography>
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
                        <Typography variant="subtitle1">Due Date</Typography>
                        <Typography variant="subtitle2">{invoice.dueDate}</Typography>
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
                        <Typography variant="subtitle1">Project Order Id</Typography>
                        <Typography variant="subtitle2">{invoice.projectOrderId}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle1">Invoice Type</Typography>
                        <Typography variant="subtitle2">{invoice.invoiceType}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={async () => {
                            await handleDownloadPdf(<InvoicePdfCard invoice={invoice} />);
                          }}>
                          Download Invoice
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => handleUpdateInvoice()}
                          color="primary"
                          variant="contained">
                          Save
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            );
          })}
        </Grid >
      </Form >
    </FormikProvider >
  );
};

UpsertBillingInfo.propTypes = {
  billingInfoId: PropTypes.string,
  invoice: PropTypes.object
};

export default UpsertBillingInfo;