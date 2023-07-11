// project import
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue, normalizeBooleanInputValue, prepareApiBody } from 'utils/stringUtils';
import currencies from 'data/currencies';
import workplaces from 'data/workplaces';

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
  }, []);


  const dispatch = useDispatch();

  return (

    <Formik
      enableReinitialize={true}
      initialValues={{
        rateCurrency: preferences?.rate?.currency,
        rateLowerLimit: preferences?.rate?.lowerLimit,
        rateUpperLimit: preferences?.rate?.upperLimit,
        workplace: preferences?.workplace,
        travelRadiusKms: preferences?.travel?.radiusKms,
        isInternationalTravelAcceptable: preferences?.travel?.isInternationalTravelAcceptable,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        rateCurrency: Yup.string().required('Currency is required.').nullable(true),
        rateLowerLimit: Yup.number().positive().integer().max(1000000).required('Lower Limit is required.').nullable(true),
        rateUpperLimit: Yup.number().positive().integer().max(1000000).nullable(true),
        workplace: Yup.string().required('Workplace Preference is required.').nullable(true),
        travelRadiusKms: Yup.number().positive().integer().max(50000).nullable(true),
        isInternationalTravelAcceptable: Yup.boolean().nullable(true)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          var requestBody = {
            rate: { currency: values.rateCurrency, lowerLimit: values.rateLowerLimit, upperLimit: values.rateUpperLimit },
            workplace: values.workplace,
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
                        Here you can provide your preferred hourly rate by specifying currency, lower limit and upper limit.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="rate-currency">Currency</InputLabel>
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
                        <InputLabel htmlFor="rate-lower-limit">Lower Limit (per hour)</InputLabel>
                        <TextField
                          fullWidth
                          id="rate-lower-limit"
                          value={normalizeInputValue(values.rateLowerLimit)}
                          name="rateLowerLimit"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Lower Limit (per hour)"
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
                        <InputLabel htmlFor="rate-upper-limit">Upper Limit (per hour)</InputLabel>
                        <TextField
                          fullWidth
                          id="rate-upper-limit"
                          value={normalizeInputValue(values.rateUpperLimit)}
                          name="rateUpperLimit"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Upper Limit (per hour)"
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
                        Here you can provide your preferred workplace type.
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="workplace">Workplace</InputLabel>
                        <Select
                          id="workplace"
                          name="workplace"
                          displayEmpty
                          value={normalizeInputValue(values.workplace)}
                          onChange={handleChange}
                        >
                          {workplaces.map((workplace) => (
                            <MenuItem key={workplace.code} value={workplace.code}>
                              {workplace.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.workplace && errors.workplace && (
                          <FormHelperText error id="mission-workplace-helper">
                            {errors.workplace}
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
                        Here you can specify your preferred maximum travel distance (one direction) and whether you can travel internationally.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="travel-radius-kms">Radius (kms)</InputLabel>
                        <TextField
                          fullWidth
                          id="travel-radius-kms"
                          value={normalizeInputValue(values.travelRadiusKms)}
                          name="travelRadiusKms"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Radius (kms)"
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
                        <InputLabel htmlFor="travel-international-acceptable">International?</InputLabel>
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
