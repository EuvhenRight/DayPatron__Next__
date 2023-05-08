// project import
import { useOutletContext } from 'react-router';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { RATE_UPDATE, RATE_GET } from 'store/reducers/actions';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import currencies from 'data/currencies';

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
  TextField
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import { openSnackbar } from 'store/reducers/snackbar';

function useInputRef() {
  return useOutletContext();
}

const PreferenceRatePage = () => {
  const { keycloak } = useKeycloak();

  const fetchRate = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/rates',
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
      let res = await fetchRate();
      if (res.success) {
        dispatch({ type: RATE_GET, payload: res.data });
      }
    })();
  }, []);


  const dispatch = useDispatch();
  const state = useSelector(state => state.rate);
  const inputRef = useInputRef();

  return (
    <MainCard>
      <Formik
        enableReinitialize={true}
        initialValues={{
          currency: state.currency,
          lowerLimit: state.lowerLimit,
          upperLimit: state.upperLimit,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          currency: Yup.string().required('Currency is required.').nullable(true),
          lowerLimit: Yup.number().positive().integer().max(1000000).required('Lower Limit is required.').nullable(true),
          upperLimit: Yup.number().positive().integer().max(1000000).nullable(true),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/rates',
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
                  message: 'Rate update failed.',
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

            dispatch({ type: RATE_UPDATE, payload: json });

            dispatch(
              openSnackbar({
                open: true,
                message: 'Rate updated.',
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
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="rate-currency">Currency</InputLabel>
                    <Autocomplete
                      id="rate-currency"
                      fullWidth
                      value={values?.currency ? currencies.filter((item) => item.code === values?.currency)[0] : null}
                      onBlur={handleBlur}
                      onChange={(event, newValue) => {
                        setFieldValue('currency', newValue === null ? '' : newValue.code);
                      }}
                      options={currencies}
                      autoHighlight
                      isOptionEqualToValue={(option, value) => option.code === value?.code}
                      getOptionLabel={(option) => option.code}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.regionCode && (
                            <img
                              loading="lazy"
                              width="20"
                              src={`https://flagcdn.com/w20/${option.regionCode.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${option.regionCode.toLowerCase()}.png 2x`}
                              alt=""
                            />
                          )}
                          {option.code}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Choose a currency"
                          name="currency"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password' // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {touched.currency && errors.currency && (
                      <FormHelperText error id="rate-currency-helper">
                        {errors.currency}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="rate-lower-limit">Lower Limit</InputLabel>
                    <TextField
                      fullWidth
                      id="rate-lower-limit"
                      value={normalizeInputValue(values.lowerLimit)}
                      name="lowerLimit"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Lower Limit"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.lowerLimit && errors.lowerLimit && (
                      <FormHelperText error id="rate-lower-limit-helper">
                        {errors.lowerLimit}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="rate-upper-limit">Upper Limit</InputLabel>
                    <TextField
                      fullWidth
                      id="rate-upper-limit"
                      value={normalizeInputValue(values.upperLimit)}
                      name="upperLimit"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Upper Limit"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.upperLimit && errors.upperLimit && (
                      <FormHelperText error id="rate-upper-limit-helper">
                        {errors.upperLimit}
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

export default PreferenceRatePage;
