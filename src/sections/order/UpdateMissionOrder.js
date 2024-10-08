import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Rte from 'components/Rte';
import InfoWrapper from 'components/InfoWrapper';

// material-ui
import {
  TextField,
  FormHelperText,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  Stack,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
  Box
} from '@mui/material';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import { openSnackbar } from 'store/reducers/snackbar';

import { addHours, addDays, addMonths } from "date-fns";

import { normalizeInputValue, prepareApiBody, normalizeNullableInputValue } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';
import rateTypes from 'data/rateTypes';
import countries from 'data/countries';

// constant
const getInitialValues = (missionOrder) => {
  const result = {
    id: missionOrder?.id,

    rateType: missionOrder?.rateType,
    duration: missionOrder?.duration,
    startDate: missionOrder?.startDate ? new Date(missionOrder?.startDate) : null,
    endDate: missionOrder?.endDate ? new Date(missionOrder?.endDate) : null,

    contractorServiceOrderDescription: missionOrder?.contractorServiceOrder?.description,
    contractorServiceOrderDuration: missionOrder?.contractorServiceOrder?.duration,
    contractorServiceOrderRateType: missionOrder?.contractorServiceOrder?.rateType,
    contractorServiceOrderRateAmount: missionOrder?.contractorServiceOrder?.rateAmount,

    employerServiceOrderDescription: missionOrder?.employerServiceOrder?.description,
    employerServiceOrderDuration: missionOrder?.employerServiceOrder?.duration,
    employerServiceOrderRateType: missionOrder?.employerServiceOrder?.rateType,
    employerServiceOrderRateAmount: missionOrder?.employerServiceOrder?.rateAmount,

    contractorLegalEntityName: missionOrder?.contractorLegalEntityName,
    contractorLegalEntityRepresentativeName: missionOrder?.contractorLegalEntityRepresentativeName,
    contractorStreet: missionOrder?.contractorStreet,
    contractorStreetNumber: missionOrder?.contractorStreetNumber,
    contractorPostCode: missionOrder?.contractorPostCode,
    contractorCity: missionOrder?.contractorCity,
    contractorCountry: missionOrder?.contractorCountry,
    contractorVatNumber: missionOrder?.contractorVatNumber,
    contractorChamberOfCommerceIdentifier: missionOrder?.contractorChamberOfCommerceIdentifier,

    employerLegalEntityName: missionOrder?.employerLegalEntityName,
    employerLegalEntityRepresentativeName: missionOrder?.employerLegalEntityRepresentativeName,
    employerStreet: missionOrder?.employerStreet,
    employerStreetNumber: missionOrder?.employerStreetNumber,
    employerPostCode: missionOrder?.employerPostCode,
    employerCity: missionOrder?.employerCity,
    employerCountry: missionOrder?.employerCountry
  };

  return result;
};

const UpdateMissionOrder = ({ missionOrderId }) => {
  const { keycloak } = useKeycloak();

  const [missionOrder, setMissionOrder] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getMissionOrder = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders/' + missionOrderId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const bindMissionOrder = async () => {
    let missionOrderResponse = await getMissionOrder();

    setMissionOrder(missionOrderResponse);
  };

  useEffect(() => {
    (async () => {
      if (missionOrderId) {
        await bindMissionOrder();
      }
    })();
  }, [missionOrderId, keycloak?.idToken]);

  const MissionSchema = Yup.object().shape({
    
    rateType: Yup.string().max(255).required('Required').nullable(true),
    duration: Yup.number().test('is-decimal', 'Invalid duration', value => {
      if (!value)
        return true;
      return (value + "").match(/^\d*\.?\d*$/);
    }).max(0).max(999999).nullable(true),
    startDate: Yup.string().required('Required').nullable(true),

    contractorServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    contractorServiceOrderDuration: Yup.number().test('is-decimal', 'Invalid duration', value => {
      if (!value)
        return true;
      return (value + "").match(/^\d*\.?\d*$/);
    }).max(0).max(999999).nullable(true),
    contractorServiceOrderRateType: Yup.string().max(255).required('Required').nullable(true),
    contractorServiceOrderRateAmount: Yup.number().required("Required").test('is-decimal', 'Invalid rate', value => {
      if (!value)
        return true;
      return (value + "").match(/^\d*\.?\d*$/);
    }).max(0).max(9999999).nullable(true),
    employerServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    employerServiceOrderDuration: Yup.number().test('is-decimal', 'Invalid duration', value => {
      if (!value)
        return true;
      return (value + "").match(/^\d*\.?\d*$/);
    }).max(0).max(999999).nullable(true),
    employerServiceOrderRateType: Yup.string().max(255).required('Required').nullable(true),
    employerServiceOrderRateAmount: Yup.number().required("Required").test('is-decimal', 'Invalid rate', value => {
      if (!value)
        return true;
      return (value + "").match(/^\d*\.?\d*$/);
    }).max(0).max(9999999).nullable(true),

    contractorLegalEntityName: Yup.string().max(255).nullable(true),
    contractorLegalEntityRepresentativeName: Yup.string().max(255).nullable(true),
    contractorStreet: Yup.string().max(255).nullable(true),
    contractorStreetNumber: Yup.string().max(255).nullable(true),
    contractorPostCode: Yup.string().max(255).nullable(true),
    contractorCity: Yup.string().max(255).nullable(true),
    contractorCountry: Yup.string().max(255).nullable(true),
    contractorVatNumber: Yup.string().max(255).nullable(true),
    contractorChamberOfCommerceIdentifier: Yup.string().max(255).nullable(true),

    employerLegalEntityName: Yup.string().max(255).nullable(true),
    employerLegalEntityRepresentativeName: Yup.string().max(255).nullable(true),
    employerStreet: Yup.string().max(255).nullable(true),
    employerStreetNumber: Yup.string().max(255).nullable(true),
    employerPostCode: Yup.string().max(255).nullable(true),
    employerCity: Yup.string().max(255).nullable(true),
    employerCountry: Yup.string().max(255).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(missionOrder),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = {
          rateType: values.rateType,
          duration: values.duration,
          startDate: values.startDate,

          contractorLegalEntityName: values.contractorLegalEntityName,
          contractorLegalEntityRepresentativeName: values.contractorLegalEntityRepresentativeName,
          contractorStreet: values.contractorStreet,
          contractorStreetNumber: values.contractorStreetNumber,
          contractorPostCode: values.contractorPostCode,
          contractorCity: values.contractorCity,
          contractorCountry: values.contractorCountry,
          contractorVatNumber: values.contractorVatNumber,
          contractorChamberOfCommerceIdentifier: values.contractorChamberOfCommerceIdentifier,
          
          employerLegalEntityName: values.employerLegalEntityName,
          employerLegalEntityRepresentativeName: values.employerLegalEntityRepresentativeName,
          employerStreet: values.employerStreet,
          employerStreetNumber: values.employerStreetNumber,
          employerPostCode: values.employerPostCode,
          employerCity: values.employerCity,
          employerCountry: values.employerCountry,

          contractorServiceOrder: {
            description: values.contractorServiceOrderDescription,
            duration: values.contractorServiceOrderDuration,
            rateType: values.contractorServiceOrderRateType,
            rateAmount: values.contractorServiceOrderRateAmount
          },

          employerServiceOrder: {
            description: values.employerServiceOrderDescription,
            duration: values.employerServiceOrderDuration,
            rateType: values.employerServiceOrderRateType,
            rateAmount: values.employerServiceOrderRateAmount
          }
        };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders/' + missionOrder.id,
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

        navigate('/orders');

        dispatch(
          openSnackbar({
            open: true,
            message: 'Mission order updated.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  const setOrderEndDate = (rateType, startDate, duration) => {
    if (!rateType || !startDate || !duration){
      setFieldValue('endDate', null);
      return;
    }

    if(rateType === 'Daily') {
      let result = addDays(startDate, duration); 
      setFieldValue('endDate', result);
      return;
    }
    
    if(rateType === 'Hourly') {
      let result = addHours(startDate, duration);
      setFieldValue('endDate', result);
      return;
    }
    
    if(rateType === 'Monthly') {
      let result = addMonths(startDate, duration);
      setFieldValue('endDate', result);
      return;
    }
    
    if(rateType === 'Fixed') {
      let result = addMonths(startDate, duration);
      setFieldValue('endDate', result);
      return;
    }
    
    setFieldValue('endDate', null);
  }

  useEffect(() => {
    (async () => {
      setFieldValue('employerServiceOrderRateType', values?.rateType);
      setFieldValue('contractorServiceOrderRateType', values?.rateType);
    })();
  }, [values?.rateType]);

  useEffect(() => {
    (async () => {
      setFieldValue('employerServiceOrderDuration', values?.duration);
      setFieldValue('contractorServiceOrderDuration', values?.duration);
    })();
  }, [values?.duration]);

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthrozied</Typography>

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_rate_type_tooltip">
                    <InputLabel htmlFor="rateType">Rate Type</InputLabel>
                  </InfoWrapper>

                  <Select
                    id="rateType"
                    name="rateType"
                    displayEmpty
                    value={normalizeInputValue(values.rateType)}
                    onChange={(e) => {
                      setFieldValue('rateType', e.target.value);
                      setOrderEndDate(e.target.value, values?.startDate, values?.duration);
                    }}
                  >
                    {rateTypes.map((rateType) => (
                      <MenuItem key={rateType.code} value={rateType.code}>
                        {rateType.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.rateType && errors.rateType && (
                    <FormHelperText error id="order-rate-type-helper">
                      {errors.rateType}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_duration_tooltip">
                    <InputLabel htmlFor="duration">Effort</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="duration"
                    placeholder="Enter duration"
                    value={normalizeInputValue(values.duration)}
                    name="duration"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue('duration', e.target.value);
                      setOrderEndDate(values?.rateType, values?.startDate, e.target.value);
                    }}
                  />
                  {touched.duration && errors.duration && (
                    <FormHelperText error id="order-duration-helper">
                      {errors.duration}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="startDate">Start Date</InputLabel>
                  <DesktopDatePicker
                    value={normalizeNullableInputValue(values.startDate)}
                    inputFormat="yyyy-MM-dd hh:mm:ss"
                    onChange={(date) => {
                      setFieldValue('startDate', date);
                      setOrderEndDate(values?.rateType, date, values?.duration);
                    }}
                    renderInput={(props) => (
                      <>
                        <TextField id="startDate" fullWidth {...props} placeholder="Start Date" name="startDate" />
                        {touched.startDate && errors.startDate && (
                          <FormHelperText error id="order-start-date-helper">
                            {errors.startDate}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="endDate">End Date</InputLabel>
                  <TextField disabled={true} fullWidth value={values?.endDate ? format(values?.endDate, "yyyy-MM-dd hh:mm:ss") : ''} />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Company Service Order</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_employer_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-employer-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <Rte
                    id="mission-order-employer-service-order-description"
                    value={values?.employerServiceOrderDescription}
                    onChange={(e) => setFieldValue('employerServiceOrderDescription', e)}
                  />
                  {touched.employerServiceOrderDescription && errors.employerServiceOrderDescription && (
                    <FormHelperText error id="mission-order-employer-service-order-description-helper">
                      {errors.employerServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_employer_service_order_rate_type_tooltip">
                    <InputLabel htmlFor="employer-service-order-rate-type">Rate Type</InputLabel>
                  </InfoWrapper>

                  <Select
                    id="employerServiceOrderRateType"
                    name="employerServiceOrderRateType"
                    displayEmpty
                    value={normalizeInputValue(values?.employerServiceOrderRateType)}
                    onChange={handleChange}
                  >
                    {rateTypes.map((rateType) => (
                      <MenuItem key={rateType.code} value={rateType.code}>
                        {rateType.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.employerServiceOrderRateType && errors.employerServiceOrderRateType && (
                    <FormHelperText error id="employer-service-order-rate-type-helper">
                      {errors.employerServiceOrderRateType}
                    </FormHelperText>
                  )}

                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_employer_service_order_rate_amount_tooltip">
                    <InputLabel htmlFor="employer-service-order-rate-amount">Rate</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="employer-service-order-rate-amount"
                    placeholder="Enter rate amount"
                    value={normalizeInputValue(values.employerServiceOrderRateAmount)}
                    name="employerServiceOrderRateAmount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.employerServiceOrderRateAmount && errors.employerServiceOrderRateAmount && (
                    <FormHelperText error id="employer-service-order-rate-amount-helper">
                      {errors.employerServiceOrderRateAmount}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_employer_service_order_duration_tooltip">
                    <InputLabel htmlFor="employer-service-order-duration">Effort</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="employer-service-order-duration"
                    placeholder="Enter duration"
                    value={normalizeInputValue(values?.employerServiceOrderDuration)}
                    name="employerServiceOrderDuration"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.employerServiceOrderDuration && errors.employerServiceOrderDuration && (
                    <FormHelperText error id="employer-service-order-duration-helper">
                      {errors.employerServiceOrderDuration}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Talent Service Order</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-contractor-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <Rte
                    id="mission-order-contractor-service-order-description"
                    value={values?.contractorServiceOrderDescription}
                    onChange={(e) => setFieldValue('contractorServiceOrderDescription', e)}
                  />
                  {touched.contractorServiceOrderDescription && errors.contractorServiceOrderDescription && (
                    <FormHelperText error id="mission-order-contractor-service-order-description-helper">
                      {errors.contractorServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_rate_type_tooltip">
                    <InputLabel htmlFor="contractor-service-order-rate-type">Rate Type</InputLabel>
                  </InfoWrapper>

                  <Select
                    id="contractorServiceOrderRateType"
                    name="contractorServiceOrderRateType"
                    displayEmpty
                    value={normalizeInputValue(values?.contractorServiceOrderRateType)}
                    onChange={handleChange}
                  >
                    {rateTypes.map((rateType) => (
                      <MenuItem key={rateType.code} value={rateType.code}>
                        {rateType.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.contractorServiceOrderRateType && errors.contractorServiceOrderRateType && (
                    <FormHelperText error id="contractor-service-order-rate-type-helper">
                      {errors.contractorServiceOrderRateType}
                    </FormHelperText>
                  )}

                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_rate_amount_tooltip">
                    <InputLabel htmlFor="contractor-service-order-rate-amount">Rate</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="contractor-service-order-rate-amount"
                    placeholder="Enter rate amount"
                    value={normalizeInputValue(values.contractorServiceOrderRateAmount)}
                    name="contractorServiceOrderRateAmount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.contractorServiceOrderRateAmount && errors.contractorServiceOrderRateAmount && (
                    <FormHelperText error id="contractor-service-order-rate-amount-helper">
                      {errors.contractorServiceOrderRateAmount}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_duration_tooltip">
                    <InputLabel htmlFor="contractor-service-order-duration">Effort</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="contractor-service-order-duration"
                    placeholder="Enter duration"
                    value={normalizeInputValue(values?.contractorServiceOrderDuration)}
                    name="contractorServiceOrderDuration"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.contractorServiceOrderDuration && errors.contractorServiceOrderDuration && (
                    <FormHelperText error id="contractor-service-order-duration-helper">
                      {errors.contractorServiceOrderDuration}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Company Billing Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Legal Entity Name</Typography>
                  <TextField
                    fullWidth
                    id="employer-legal-entity-name"
                    placeholder="Enter legal entity name"
                    value={normalizeInputValue(values?.employerLegalEntityName)}
                    name="employerLegalEntityName"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerLegalEntityName && errors.employerLegalEntityName && (
                      <FormHelperText error id="employer-legal-entity-name-helper">
                        {errors.employerLegalEntityName}
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
                    id="employer-legal-representative-name"
                    placeholder="Enter legal representative name"
                    value={normalizeInputValue(values?.employerLegalEntityRepresentativeName)}
                    name="employerLegalEntityRepresentativeName"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerLegalEntityRepresentativeName && errors.employerLegalEntityRepresentativeName && (
                      <FormHelperText error id="employer-legal-representative-name-helper">
                        {errors.employerLegalEntityRepresentativeName}
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
                    id="employer-street"
                    placeholder="Enter street"
                    value={normalizeInputValue(values?.employerStreet)}
                    name="employerStreet"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerStreet && errors.employerStreet && (
                      <FormHelperText error id="employer-street-helper">
                        {errors.employerStreet}
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
                    id="employer-street-number"
                    placeholder="Enter street number"
                    value={normalizeInputValue(values?.employerStreetNumber)}
                    name="employerStreetNumber"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerStreetNumber && errors.employerStreetNumber && (
                      <FormHelperText error id="employer-street-number-helper">
                        {errors.employerStreetNumber}
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
                    id="employer-city"
                    placeholder="Enter city"
                    value={normalizeInputValue(values?.employerCity)}
                    name="employerCity"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerCity && errors.employerCity && (
                      <FormHelperText error id="employer-city-helper">
                        {errors.employerCity}
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
                    id="employer-post-code"
                    placeholder="Enter post code"
                    value={normalizeInputValue(values?.employerPostCode)}
                    name="employerPostCode"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.employerPostCode && errors.employerPostCode && (
                      <FormHelperText error id="employer-post-code-helper">
                        {errors.employerPostCode}
                      </FormHelperText>
                    )
                  }
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Country</Typography>

                  <Autocomplete
                    id="employer-country"
                    fullWidth
                    value={values?.employerCountry ? countries.find((item) => item.code === values?.employerCountry) : null}
                    onBlur={handleBlur}
                    onChange={(event, newValue) => {
                      setFieldValue('employerCountry', newValue === null ? '' : newValue.code);
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
                  {touched.employerCountry && errors.employerCountry && (
                    <FormHelperText error id="employer-country-helper">
                      {errors.employerCountry}
                    </FormHelperText>
                  )}

                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Talent Billing Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <Typography variant="subtitle1">Legal Entity Name</Typography>
                    <TextField
                      fullWidth
                      id="contractor-legal-entity-name"
                      placeholder="Enter legal entity name"
                      value={normalizeInputValue(values?.contractorLegalEntityName)}
                      name="contractorLegalEntityName"
                      onBlur={handleBlur}
                      onChange={handleChange} />
                    {
                      touched.contractorLegalEntityName && errors.contractorLegalEntityName && (
                        <FormHelperText error id="contractor-legal-entity-name-helper">
                          {errors.contractorLegalEntityName}
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
                    id="contractor-legal-representative-name"
                    placeholder="Enter legal representative name"
                    value={normalizeInputValue(values?.contractorLegalEntityRepresentativeName)}
                    name="contractorLegalEntityRepresentativeName"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorLegalEntityRepresentativeName && errors.contractorLegalEntityRepresentativeName && (
                      <FormHelperText error id="contractor-legal-representative-name-helper">
                        {errors.contractorLegalEntityRepresentativeName}
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
                    id="contractor-street"
                    placeholder="Enter street"
                    value={normalizeInputValue(values?.contractorStreet)}
                    name="contractorStreet"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorStreet && errors.contractorStreet && (
                      <FormHelperText error id="contractor-street-helper">
                        {errors.contractorStreet}
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
                    id="contractor-street-number"
                    placeholder="Enter street number"
                    value={normalizeInputValue(values?.contractorStreetNumber)}
                    name="contractorStreetNumber"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorStreetNumber && errors.contractorStreetNumber && (
                      <FormHelperText error id="contractor-street-number-helper">
                        {errors.contractorStreetNumber}
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
                    id="contractor-city"
                    placeholder="Enter city"
                    value={normalizeInputValue(values?.contractorCity)}
                    name="contractorCity"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorCity && errors.contractorCity && (
                      <FormHelperText error id="contractor-city-helper">
                        {errors.contractorCity}
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
                    id="contractor-post-code"
                    placeholder="Enter post code"
                    value={normalizeInputValue(values?.contractorPostCode)}
                    name="contractorPostCode"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorPostCode && errors.contractorPostCode && (
                      <FormHelperText error id="contractor-post-code-helper">
                        {errors.contractorPostCode}
                      </FormHelperText>
                    )
                  }
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Country</Typography>

                  <Autocomplete
                    id="contractor-country"
                    fullWidth
                    value={values?.contractorCountry ? countries.find((item) => item.code === values?.contractorCountry) : null}
                    onBlur={handleBlur}
                    onChange={(event, newValue) => {
                      setFieldValue('contractorCountry', newValue === null ? '' : newValue.code);
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
                  {touched.contractorCountry && errors.contractorCountry && (
                    <FormHelperText error id="contractor-country-helper">
                      {errors.contractorCountry}
                    </FormHelperText>
                  )}

                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">VAT #</Typography>
                  <TextField
                    fullWidth
                    id="contractor-vat-number"
                    placeholder="Enter VAT #"
                    value={normalizeInputValue(values?.contractorVatNumber)}
                    name="contractorVatNumber"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorVatNumber && errors.contractorVatNumber && (
                      <FormHelperText error id="contractor-vat-number-helper">
                        {errors.contractorVatNumber}
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
                    id="contractor-coc-number"
                    placeholder="Enter CoC #"
                    value={normalizeInputValue(values?.contractorChamberOfCommerceIdentifier)}
                    name="contractorChamberOfCommerceIdentifier"
                    onBlur={handleBlur}
                    onChange={handleChange} />
                  {
                    touched.contractorChamberOfCommerceIdentifier && errors.contractorChamberOfCommerceIdentifier && (
                      <FormHelperText error id="contractor-coc-number-helper">
                        {errors.contractorChamberOfCommerceIdentifier}
                      </FormHelperText>
                    )
                  }
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button color="error" onClick={() => { navigate('/orders'); }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {missionOrder ? 'Update' : 'Create'}
              </Button>
            </Stack>
          </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

UpdateMissionOrder.propTypes = {
  missionId: PropTypes.any
};

export default UpdateMissionOrder;
