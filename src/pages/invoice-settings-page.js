import { useEffect, useState } from 'react';
import countries from 'data/countries';
import { useDispatch, useSelector } from 'react-redux';

import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';
import InfoWrapper from 'components/InfoWrapper';

// ==============================|| PERSONAL ||============================== //

const InvoiceSettingsPage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const [state, setState] = useState(null);
  const [employerId, setEmployerId] = useState(null);
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
      await bindEmployers();
    })();
  }, []);

  const bindData = async () => {
    if (!employerId)
      return;
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + encodeURIComponent(employerId) + '/invoice-settings',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setState(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (employers && employers.length > 0) {
      setEmployerId(employers[0].id);
    }
  }, [employers]);

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, [employerId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        {employers?.length > 0 ? 
          (<Stack spacing={1.25}>
            <InfoWrapper tooltipText="invoice_settings_company">
              <InputLabel htmlFor="mission-title">Company</InputLabel>
            </InfoWrapper>
            <Select
              fullWidth
              sx={{ width: '300px' }}
              id="employerId"
              name="employerId"
              displayEmpty
              value={normalizeInputValue(employerId)}
              onChange={(event) => { setEmployerId(event.target.value); }}
            >
              {employers?.map((employer) => (
                <MenuItem key={employer?.id} value={employer?.id}>
                  {employer?.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>)
          :
          (<Typography>No companies found.</Typography>)
        }
      </Grid>
      {employerId &&
        <Grid item xs={12}>

          <MainCard content={false} sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                name: state?.name,
                street: state?.street,
                streetNumber: state?.streetNumber,
                city: state?.city,
                postCode: state?.postCode,
                country: state?.country,
                vatNumber: state?.vatNumber,
                bankName: state?.bankName,
                bankAccountName: state?.bankAccountName,
                iban: state?.iban,
                email: state?.email,
                submit: null
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().max(255).nullable(true).required('Invoicing name is required.'),
                street: Yup.string().max(255).nullable(true).required('Street is required.'),
                streetNumber: Yup.string().max(255).nullable(true).required('Street number is required.'),
                city: Yup.string().max(255).nullable(true).required('City is required.'),
                postCode: Yup.string().max(255).nullable(true).required('Postal code is required.'),
                country: Yup.string().nullable(true).required('Country is required.'),
                vatNumber: Yup.string().max(255).nullable(true),
                bankName: Yup.string().max(255).nullable(true),
                bankAccountName: Yup.string().max(255).nullable(true),
                iban: Yup.string().max(255).nullable(true),
                email: Yup.string().email('Invalid invoicing email address.').max(255).required('Invoicing email address is required.')
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + encodeURIComponent(employerId) + '/invoice-settings',
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
                        message: 'Update failed.',
                        variant: 'alert',
                        alert: {
                          color: 'error'
                        },
                        close: false
                      })
                    );

                    setStatus({ success: false });
                    setSubmitting(false);

                    return;
                  }

                  let json = await response.json();

                  setState(json);

                  dispatch(
                    openSnackbar({
                      open: true,
                      message: 'Data updated.',
                      variant: 'alert',
                      alert: {
                        color: 'success'
                      },
                      close: false
                    })
                  );

                  setStatus({ success: true });
                  setSubmitting(false);
                  setErrors({});
                } catch (err) {
                  setErrors({ submit: err.message });
                  setStatus({ success: false });
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Box sx={{ p: 2.5 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_invoicing_name_tooltip">
                            <InputLabel htmlFor="invoice-settings-name">Invoicing Name</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-invoicing-name"
                            value={normalizeInputValue(values.name)}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Invoicing name"
                            autoFocus
                          />
                          {touched.name && errors.name && (
                            <FormHelperText error id="invoice-settings-name-helper">
                              {errors.name}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_vat_number_tooltip">
                            <InputLabel htmlFor="invoice-settings-vat-number">VAT Number</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-vat-number"
                            value={normalizeInputValue(values.vatNumber)}
                            name="vatNumber"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="VAT Number"
                            autoFocus
                          />
                          {touched.vatNumber && errors.vatNumber && (
                            <FormHelperText error id="invoice-settings-vat-number-helper">
                              {errors.vatNumber}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_bank_name_tooltip">
                            <InputLabel htmlFor="invoice-settings-bank-name">Bank Name</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-bank-name"
                            value={normalizeInputValue(values.bankName)}
                            name="bankName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Bank Name"
                            autoFocus
                          />
                          {touched.bankAName && errors.bankName && (
                            <FormHelperText error id="invoice-settings-bank-name-helper">
                              {errors.bankName}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_bank_account_name_tooltip">
                            <InputLabel htmlFor="invoice-settings-bank-account-name">Bank Account Name</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-bank-account-name"
                            value={normalizeInputValue(values.bankAccountName)}
                            name="bankAccountName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Bank Account Name"
                            autoFocus
                          />
                          {touched.bankAccountName && errors.bankAccountName && (
                            <FormHelperText error id="invoice-settings-bank-account-name-helper">
                              {errors.bankAccountName}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_iban_tooltip">
                            <InputLabel htmlFor="invoice-settings-iban">Iban</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-iban"
                            value={normalizeInputValue(values.iban)}
                            name="iban"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Iban"
                            autoFocus
                          />
                          {touched.iban && errors.iban && (
                            <FormHelperText error id="invoice-settings-iban-helper">
                              {errors.iban}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_invoicing_email_address_tooltip">
                            <InputLabel htmlFor="invoice-settings-email">Invoicing Email Address</InputLabel>
                          </InfoWrapper>
                          <TextField
                            type="email"
                            fullWidth
                            value={normalizeInputValue(values.email)}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            id="invoice-settings-email"
                            placeholder="Invoicing email address"
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="invoice-settings-email-helper">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h5">Address</Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_address_street_tooltip">
                            <InputLabel htmlFor="invoice-settings-street">Street</InputLabel>
                          </InfoWrapper>

                          <TextField
                            fullWidth
                            id="invoice-settings-street"
                            placeholder="Enter Street"
                            value={normalizeInputValue(values.street)}
                            name="street"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.street && errors.street && (
                            <FormHelperText error id="invoice-settings-street-helper">
                              {errors.street}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_address_street_number_tooltip">
                            <InputLabel htmlFor="invoice-settings-street-number">Street Number</InputLabel>
                          </InfoWrapper>

                          <TextField
                            fullWidth
                            id="invoice-settings-street-number"
                            placeholder="Enter street number"
                            value={normalizeInputValue(values.streetNumber)}
                            name="streetNumber"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.streetNumber && errors.streetNumber && (
                            <FormHelperText error id="invoice-settings-streetNumber-helper">
                              {errors.streetNumber}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_address_city_tooltip">
                            <InputLabel htmlFor="invoice-settings-city">City</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-city"
                            placeholder="Enter city"
                            value={normalizeInputValue(values.city)}
                            name="city"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.city && errors.city && (
                            <FormHelperText error id="invoice-settings-city-helper">
                              {errors.city}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_address_postal_code_tooltip">
                            <InputLabel htmlFor="invoice-settings-post-code">Postal Code</InputLabel>
                          </InfoWrapper>
                          <TextField
                            fullWidth
                            id="invoice-settings-post-code"
                            placeholder="Enter postal code"
                            value={normalizeInputValue(values.postCode)}
                            name="postCode"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.postCode && errors.postCode && (
                            <FormHelperText error id="invoice-settings-post-code-helper">
                              {errors.postCode}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1.25}>
                          <InfoWrapper tooltipText="invoice_settings_address_country_tooltip">
                            <InputLabel htmlFor="invoice-settings-country">Country</InputLabel>
                          </InfoWrapper>
                          <Autocomplete
                            id="invoice-settings-country"
                            fullWidth
                            value={values?.country ? countries.filter((item) => item.code === values?.country)[0] : null}
                            onBlur={handleBlur}
                            onChange={(event, newValue) => {
                              setFieldValue('country', newValue === null ? '' : newValue.code);
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
                          {touched.country && errors.country && (
                            <FormHelperText error id="invoice-settings-country-helper">
                              {errors.country}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                    </Grid>
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                      <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                        Save
                      </Button>
                    </Stack>
                  </Box>
                </form>
              )}
            </Formik>
          </MainCard>
        </Grid>
      }
    </Grid>
  );
};

export default InvoiceSettingsPage;
