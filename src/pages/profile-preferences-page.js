// project import
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';
import currencies from 'data/currencies';
import workplaces from 'data/workplaces';
import InfoWrapper from 'components/InfoWrapper';

// material-ui
import {
  Select,
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  MenuItem,
  Switch,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';

const ProfilePreferencesPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const [preferences, setPreferences] = useState(null);

  const fetchPreferences = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/preferences',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      return { success: true, data: json };
    } catch (error) {
      return { success: false };
    }
  }
  useEffect(() => {
    (async () => {
      let res = await fetchPreferences();
      if (res.success) {
        setPreferences(res.data);
      }
    })();
  }, [personalInformation?.id, keycloak?.idToken]);


  const dispatch = useDispatch();

  return (

    <Formik
      enableReinitialize={true}
      initialValues={{
        rateCurrency: preferences?.rate?.currency,
        rateLowerLimit: preferences?.rate?.lowerLimit,
        rateUpperLimit: preferences?.rate?.upperLimit,
        workplaces: preferences?.workplaces,
        travelRadiusKms: preferences?.travel?.radiusKms,
        isInternationalTravelAcceptable: preferences?.travel?.isInternationalTravelAcceptable,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        rateCurrency: Yup.string().required('Currency is required.').nullable(true),
        rateLowerLimit: Yup.number().positive().integer().max(1000000).required('Lower Limit is required.').nullable(true),
        rateUpperLimit: Yup.number().positive().integer().max(1000000).nullable(true),
        workplaces: Yup.array().of(Yup.string()).nullable(true),
        travelRadiusKms: Yup.number().positive().integer().max(50000).nullable(true),
        isInternationalTravelAcceptable: Yup.boolean().nullable(true)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          var requestBody = {
            rate: { currency: values.rateCurrency, lowerLimit: values.rateLowerLimit, upperLimit: values.rateUpperLimit },
            workplaces: values.workplaces,
            travel: { radiusKms: values.travelRadiusKms, isInternationalTravelAcceptable: values.isInternationalTravelAcceptable }
          };
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/preferences',
            {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: prepareApiBody(requestBody)
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

          setPreferences(json);

          dispatch(
            openSnackbar({
              open: true,
              message: 'Preferences updated.',
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
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, setFieldValue, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <MainCard title="Rate">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography color="secondary">
                        Please let us know your preferred hourly rate by specifying your currency, lower and upper limit.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_rate_currency_tooltip">
                          <InputLabel htmlFor="rate-currency">Currency</InputLabel>
                        </InfoWrapper>
                        <Select
                          id="rateCurrency"
                          name="rateCurrency"
                          displayEmpty
                          value={normalizeInputValue(values.rateCurrency)}
                          onChange={handleChange}
                        >
                          {currencies.map((currency) => (
                            <MenuItem key={currency.code} value={currency.code}>
                              {currency.code}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.rateCurrency && errors.rateCurrency && (
                          <FormHelperText error id="mission-rate-currency-helper">
                            {errors.rateCurrency}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_rate_lower_limit_tooltip">
                          <InputLabel htmlFor="rate-lower-limit">Lower Limit</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="rate-lower-limit"
                          value={normalizeInputValue(values.rateLowerLimit)}
                          name="rateLowerLimit"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Lower Limit"
                          type="number"
                          autoFocus
                        />
                        {touched.rateLowerLimit && errors.rateLowerLimit && (
                          <FormHelperText error id="rate-lower-limit-helper">
                            {errors.rateLowerLimit}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_rate_upper_limit_tooltip">
                          <InputLabel htmlFor="rate-upper-limit">Upper Limit</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="rate-upper-limit"
                          value={normalizeInputValue(values.rateUpperLimit)}
                          name="rateUpperLimit"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Upper Limit"
                          type="number"
                          autoFocus
                        />
                        {touched.rateUpperLimit && errors.rateUpperLimit && (
                          <FormHelperText error id="rate-upper-limit-helper">
                            {errors.rateUpperLimit}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <MainCard title="Workplace">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography color="secondary">
                        Please select your preferred workplace type (multiple options possible).
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_workplace_tooltip">
                          <InputLabel htmlFor="workplaces">Workplace</InputLabel>
                        </InfoWrapper>
                        <Select
                          multiple
                          id="workplaces"
                          name="workplaces"
                          displayEmpty
                          value={values.workplaces ?? []}
                          onChange={handleChange}
                        >
                          {workplaces.map((workplace) => (
                            <MenuItem key={workplace.code} value={workplace.code}>
                              {workplace.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.workplaces && errors.workplaces && (
                          <FormHelperText error id="mission-workplaces-helper">
                            {errors.workplaces}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <MainCard title="Travel">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography color="secondary">
                        Please let us know what your preferred one-way maximum travel distance is and if you are willing to travel internationally.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_travel_radius_tooltip">
                          <InputLabel htmlFor="travel-radius-kms">Radius (km)</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="travel-radius-kms"
                          value={normalizeInputValue(values.travelRadiusKms)}
                          name="travelRadiusKms"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Radius (km)"
                          type="number"
                          autoFocus
                        />
                        {touched.travelRadiusKms && errors.travelRadiusKms && (
                          <FormHelperText error id="travel-radius-kms-helper">
                            {errors.travelRadiusKms}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="preferences_travel_international_tooltip">
                          <InputLabel htmlFor="travel-international-acceptable">International?</InputLabel>
                        </InfoWrapper>
                        <Stack direction="row" alignItems="center">
                          <Switch
                            id="travel-international-acceptable"
                            name="isInternationalTravelAcceptable"
                            checked={normalizeBooleanInputValue(values?.isInternationalTravelAcceptable)}
                            onChange={(event, checked) => {
                              setFieldValue("isInternationalTravelAcceptable", checked);
                            }}
                          />
                          {touched.isInternationalTravelAcceptable && errors.isInternationalTravelAcceptable && (
                            <FormHelperText error id="travel-international-acceptable-helper">
                              {errors.isInternationalTravelAcceptable}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Stack>
                    </Grid>

                  </Grid>
                </MainCard>
              </Grid>

            </Grid>
          </Box>
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button disabled={isSubmitting} type="submit" variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ProfilePreferencesPage;
