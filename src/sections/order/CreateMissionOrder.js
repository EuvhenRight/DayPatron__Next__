import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Rte from 'components/Rte';
import InfoWrapper from 'components/InfoWrapper';

import {
  TextField,
  FormHelperText,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  Typography,
  Select,
  MenuItem
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

// constant
const getInitialValues = () => {
  const result = {
    id: null,
    contractorId: null,
    employerId: null,
    missionId: null,

    rateType: null,
    duration: null,
    startDate: null,
    endDate: null,

    contractorServiceOrderDescription: null,
    contractorServiceOrderDuration: null,
    contractorServiceOrderRateType: null,
    contractorServiceOrderRateAmount: null,

    employerServiceOrderDescription: null,
    employerServiceOrderDuration: null,
    employerServiceOrderRateType: null,
    employerServiceOrderRateAmount: null
  };

  return result;
};

const CreateMissionOrder = () => {
  const { keycloak } = useKeycloak();

  const [contractors, setContractors] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [missions, setMissions] = useState([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const bindContractors = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setContractors(json.contractors);
    } catch (error) {
      console.log(error);
    }
  };

  const bindEmployers = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers',
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

  const bindMissions = async (employerId) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/' + employerId + '/missions',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMissions(json.missions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      bindContractors();
      bindEmployers();
    })();
  }, [keycloak?.idToken]);

  const MissionSchema = Yup.object().shape({
    contractorId: Yup.string().required('Talent is required').nullable(true),
    employerId: Yup.string().required('Company is required').nullable(true),
    missionId: Yup.string().required('Mission is required').nullable(true),

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
    }).max(0).max(9999999).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = {
          contractorId: values.contractorId,
          employerId: values.employerId,
          missionId: values.missionId,

          rateType: values.rateType,
          duration: values.duration,
          startDate: values.startDate,

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

        
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + body.missionId + '/contractors/' + body.contractorId + '/orders',
          {
            method: 'POST',
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
              message: 'Creating a mission order failed.',
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
            message: 'Mission order created.',
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

  const getOrderEndDate = (rateType, startDate, duration) => {
    if (!rateType || !startDate || !duration)
      return '';

    let end = '';

    if(rateType === 'Daily') {
      end = addDays(startDate, duration); 
    }
    else if(rateType === 'Hourly') {
      end = addHours(startDate, duration);
    }
    else {
      end = addMonths(startDate, duration);
    }

    return format(end, "yyyy-MM-dd hh:mm:ss");
  }

  const getContractorServiceOrderDescription = (values) => {
    let startDatePattern = '{{startDate}}';
    let durationPattern = '{{duration}}';
    let rateTypePattern = '{{rateType}}';


    let result = `<ul>
  <li>Start: week commencing ` + startDatePattern + ` for ` + durationPattern + ` ` + rateTypePattern + `.</li>
  <li>All Fees are in Euro and are excluding VAT.</li>
  <li>Payments are due as soon as the payment from the customer is received.</li>
  <li>This proposal is subject to the <a href="https://10x.team/10x-talent-terms-of-service/" target="_blank">10x Terms of Service</a> and <a href="https://10x.team/privacypolicy/" target="_blank">Privacy Statement</a>.</li>
</ul>`;

    if(values?.startDate) {
      result = result.replace(startDatePattern, format(values?.startDate, "yyyy-MM-dd"));
    }
    let currentDuration = values?.contractorServiceOrderDuration;
    if(currentDuration) {
      result = result.replace(durationPattern, currentDuration);
    }

    let currentRateType = values?.contractorServiceOrderRateType;
    if(currentRateType) {
      let rateTypeStr = rateTypes.find(rateType => rateType.code === currentRateType)?.itemLabel;
      if(currentDuration > 1) {
        rateTypeStr = rateTypeStr + 's';
      }

      result = result.replace(rateTypePattern, rateTypeStr);
    }

    return result;
  }

  const getEmployerServiceOrderDescription = (values) => {
    let startDatePattern = '{{startDate}}';
    let durationPattern = '{{duration}}';
    let rateTypePattern = '{{rateType}}';

    let result = `<ul>
      <li>Start: week commencing ` + startDatePattern + ` for ` + durationPattern + ` ` + rateTypePattern + `.</li>
      <li>All Fees are in Euro and are excluding VAT.</li>
      <li>Payments are due within 14 days after the date of the invoice.</li>
      <li>This proposal is valid until 7 days after the proposal date.</li>
      <li>Invoice schedule: 75% in advance, 25% afterwards.</li>
      <li>This proposal is subject to the <a href="https://10x.team/10x-client-terms-of-service/" target="_blank">10x Terms of Service</a>.</li>
    </ul>`;

    if(values?.startDate) {
      result = result.replace(startDatePattern, format(values?.startDate, "yyyy-MM-dd"));
    }

    let currentDuration = values?.employerServiceOrderDuration;
    if(currentDuration) {
      result = result.replace(durationPattern, currentDuration);
    }

    let currentRateType = values?.employerServiceOrderRateType;
    if(currentRateType) {
      let rateTypeStr = rateTypes.find(rateType => rateType.code === currentRateType)?.itemLabel;
      if(currentDuration > 1) {
        rateTypeStr = rateTypeStr + 's';
      }

      result = result.replace(rateTypePattern, rateTypeStr);
    }

    return result;
  }

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

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

  useEffect(() => {
    (async () => {
      setFieldValue('employerServiceOrderDescription', getEmployerServiceOrderDescription(values));
    })();
  }, [values?.employerServiceOrderRateType, values?.employerServiceOrderDuration, values?.startDate]);

  useEffect(() => {
    (async () => {
      setFieldValue('contractorServiceOrderDescription', getContractorServiceOrderDescription(values));
    })();
  }, [values?.contractorServiceOrderRateType, values?.contractorServiceOrderDuration, values?.startDate]);

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthrozied</Typography>

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>Create Mission Order</DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="mission_order_contractor_tooltip">
                      <InputLabel>Talent</InputLabel>
                    </InfoWrapper>

                    <Select
                      id="contractorId"
                      name="contractorId"
                      displayEmpty
                      value={contractors?.length > 0 ? normalizeInputValue(values.contractorId) : ''}
                      onChange={handleChange}
                    >
                      {contractors?.map((contractor) => (
                        <MenuItem key={contractor.id} value={contractor.id}>
                          {contractor.firstName + ' ' + contractor.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.contractorId && errors.contractorId && (
                      <FormHelperText error id="mission-contractor-id-helper">
                        {errors.contractorId}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="mission_order_employer_tooltip">
                      <InputLabel>Company</InputLabel>
                    </InfoWrapper>

                    <Select
                      id="employerId"
                      name="employerId"
                      displayEmpty
                      value={employers?.length > 0 ? normalizeInputValue(values.employerId) : ''}
                      onChange={(event) => { handleChange(event); setFieldValue('missionId', null); bindMissions(event.target.value); }}
                    >
                      {employers?.map((employer) => (
                        <MenuItem key={employer.id} value={employer.id}>
                          {employer.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.employerId && errors.employerId && (
                      <FormHelperText error id="mission-order-employer-id-helper">
                        {errors.employerId}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InfoWrapper tooltipText="mission_order_mission_tooltip">
                      <InputLabel>Mission</InputLabel>
                    </InfoWrapper>

                    <Select
                      id="missionId"
                      name="missionId"
                      displayEmpty
                      value={missions?.length > 0 ? normalizeInputValue(values.missionId) : ''}
                      onChange={handleChange}
                    >
                      {missions?.map((mission) => (
                        <MenuItem key={mission.id} value={mission.id}>
                          {mission.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.missionId && errors.missionId && (
                      <FormHelperText error id="mission-order-mission-id-helper">
                        {errors.missionId}
                      </FormHelperText>
                    )}

                  </Stack>
                </Grid>

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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                    <TextField disabled={true} fullWidth value={getOrderEndDate(values.rateType, values.startDate, values.duration)} />
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

              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button color="error" onClick={() => { navigate('/orders'); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Create
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

CreateMissionOrder.propTypes = {
  missionId: PropTypes.any
};

export default CreateMissionOrder;
