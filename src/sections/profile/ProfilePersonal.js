// material-ui
import { useOutletContext } from 'react-router';
import countries from 'data/countries';
import { useDispatch, useSelector } from 'react-redux';

import { useKeycloak } from '@react-keycloak/web';
import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import InfoWrapper from 'components/InfoWrapper';

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
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';
import MainCard from 'components/MainCard';

function useInputRef() {
  return useOutletContext();
}

// ==============================|| PERSONAL ||============================== //

const ProfilePersonal = () => {
  const {keycloak} = useKeycloak();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const dispatch = useDispatch();
  const state = useSelector(state => state.personalInformation);
  const inputRef = useInputRef();

  return (
    <MainCard content={false} sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          countryPhoneCode: state.countryPhoneCode,
          phoneNumber: state.phoneNumber,
          street: state.street,
          streetNumber: state.streetNumber,
          city: state.city,
          postCode: state.postCode,
          country: state.country,
          linkedInUrl: state.linkedInUrl,
          peraInterviewUrl: state.peraInterviewUrl,
          calendlyUrl: state.calendlyUrl,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First name is required.'),
          lastname: Yup.string().max(255).required('Last name is required.'),
          email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
          countryPhoneCode: Yup.string().nullable(true),
          phoneNumber: Yup.string().matches(/^[+]*[0-9]{3,}$/g, 'Phone number is not valid').max(20).nullable(true),
          street: Yup.string().nullable(true),
          streetNumber: Yup.string().nullable(true),
          city: Yup.string().nullable(true),
          postCode: Yup.string().nullable(true),
          country: Yup.string().nullable(true),
          linkedInUrl: Yup.string().max(255).nullable(true),
          peraInterviewUrl: Yup.string().max(255).nullable(true),
          calendlyUrl: Yup.string().max(255).nullable(true)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(state.id),
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

            dispatch({ type: PERSONAL_INFORMATION_UPDATE, payload: json });

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

            setStatus({ success: true });
            setSubmitting(false);
            setErrors({ });
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
                    <InfoWrapper tooltipText="personal_information_first_name_tooltip">
                      <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-first-name"
                      value={normalizeInputValue(values.firstname)}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First name"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.firstname && errors.firstname && (
                      <FormHelperText error id="personal-first-name-helper">
                        {errors.firstname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_last_name_tooltip">
                      <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-last-name"
                      value={normalizeInputValue(values.lastname)}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Last name"
                    />
                    {touched.lastname && errors.lastname && (
                      <FormHelperText error id="personal-last-name-helper">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_email_name_tooltip">
                      <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    </InfoWrapper>
                    <TextField
                      type="email"
                      fullWidth
                      value={normalizeInputValue(values.email)}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email address"
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="personal-email-helper">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_phone_number_tooltip">
                      <InputLabel htmlFor="personal-phone-number">Phone Number</InputLabel>
                    </InfoWrapper>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>

                      <Autocomplete
                        id="personal-country-phone-code"
                        sx={{ width: 250 }}
                        value={values?.countryPhoneCode ? countries.find((item) => item.phone === values?.countryPhoneCode) : null}
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          setFieldValue('countryPhoneCode', newValue === null ? '' : newValue.phone);
                        }}
                        options={countries}
                        autoHighlight
                        isOptionEqualToValue={(option, value) => option.phone === value?.phone}
                        getOptionLabel={(option) => option.phone}
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
                            {option.code && `${option.code} ${option.phone}`}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Country code"
                            name="country-phone-code"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                          />
                        )}
                      />

                      <TextField
                        fullWidth
                        id="personal-phone-number"
                        value={normalizeInputValue(values.phoneNumber)}
                        name="phoneNumber"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Phone number"
                        autoFocus
                        inputRef={inputRef}
                      />
                    </Stack>

                    {touched.phoneNumber && errors.phoneNumber && (
                      <FormHelperText error id="personal-phone-number-helper">
                        {errors.phoneNumber}
                      </FormHelperText>
                    )}

                    {touched.countryPhoneCode && errors.countryPhoneCode && (
                      <FormHelperText error id="personal-country-phone-code-helper">
                        {errors.countryPhoneCode}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_linked_in_url_tooltip">
                      <InputLabel htmlFor="personal-linked-in-url">LinkedIn Page</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-linked-in-url"
                      value={normalizeInputValue(values.linkedInUrl)}
                      name="linkedInUrl"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="LinkedIn page"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.linkedInUrl && errors.linkedInUrl && (
                      <FormHelperText error id="personal-linked-in-url-helper">
                        {errors.linkedInUrl}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_pera_interview_url_tooltip">
                      <InputLabel htmlFor="personal-pera-interview-url">Pera Interview Url</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-pera-interview-url"
                      value={normalizeInputValue(values.peraInterviewUrl)}
                      name="peraInterviewUrl"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Pera Interview Url"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.peraInterviewUrl && errors.peraInterviewUrl && (
                      <FormHelperText error id="personal-pera-interview-url-helper">
                        {errors.peraInterviewUrl}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_calendly_url_tooltip">
                      <InputLabel htmlFor="personal-calendly-url">Calendly Url</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-calendly-url"
                      value={normalizeInputValue(values.calendlyUrl)}
                      name="calendlyUrl"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Calendly Url"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.calendlyUrl && errors.calendlyUrl && (
                      <FormHelperText error id="personal-calendly-url-helper">
                        {errors.calendlyUrl}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5">Address</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_address_street_tooltip">
                      <InputLabel htmlFor="personal-street">Street</InputLabel>
                    </InfoWrapper>

                    <TextField
                      fullWidth
                      id="personal-street"
                      placeholder="Enter Street"
                      value={normalizeInputValue(values.street)}
                      name="street"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.street && errors.street && (
                      <FormHelperText error id="personal-street-helper">
                        {errors.street}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_address_street_number_tooltip">
                      <InputLabel htmlFor="personal-street-number">Street Number</InputLabel>
                    </InfoWrapper>

                    <TextField
                      fullWidth
                      id="personal-street-number"
                      placeholder="Enter street number"
                      value={normalizeInputValue(values.streetNumber)}
                      name="streetNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.streetNumber && errors.streetNumber && (
                      <FormHelperText error id="personal-streetNumber-helper">
                        {errors.streetNumber}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_address_city_tooltip">
                      <InputLabel htmlFor="personal-city">City</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-city"
                      placeholder="Enter city"
                      value={normalizeInputValue(values.city)}
                      name="city"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.city && errors.city && (
                      <FormHelperText error id="personal-city-helper">
                        {errors.city}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_address_postal_code_tooltip">
                      <InputLabel htmlFor="personal-post-code">Postal Code</InputLabel>
                    </InfoWrapper>
                    <TextField
                      fullWidth
                      id="personal-post-code"
                      placeholder="Enter postal code"
                      value={normalizeInputValue(values.postCode)}
                      name="postCode"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.postCode && errors.postCode && (
                      <FormHelperText error id="personal-post-code-helper">
                        {errors.postCode}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="personal_information_address_country_tooltip">
                      <InputLabel htmlFor="personal-country">Country</InputLabel>
                    </InfoWrapper>
                    <Autocomplete
                      id="personal-country"
                      fullWidth
                      value={values?.country ? countries.find((item) => item.code === values?.country) : null}
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
                      <FormHelperText error id="personal-country-helper">
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
  );
};

export default ProfilePersonal;