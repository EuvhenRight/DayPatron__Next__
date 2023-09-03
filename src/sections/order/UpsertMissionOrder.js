import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InfoWrapper from 'components/InfoWrapper';

// material-ui
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

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';
import rateTypes from 'data/rateTypes';

// constant
const getInitialValues = (missionOrder) => {
  const result = {
    id: missionOrder?.id,
    contractorId: missionOrder?.contractorId,
    employerId: missionOrder?.employerId,
    missionId: missionOrder?.missionId,

    contractorServiceOrderDescription: missionOrder?.contractorServiceOrder?.description,
    contractorServiceOrderDurationHours: missionOrder?.contractorServiceOrder?.durationHours,
    contractorServiceOrderRateType: missionOrder?.contractorServiceOrder?.rateType,
    contractorServiceOrderRateAmount: missionOrder?.contractorServiceOrder?.rateAmount,

    employerServiceOrderDescription: missionOrder?.employerServiceOrder?.description,
    employerServiceOrderDurationHours: missionOrder?.employerServiceOrder?.durationHours,
    employerServiceOrderRateType: missionOrder?.employerServiceOrder?.rateType,
    employerServiceOrderRateAmount: missionOrder?.employerServiceOrder?.rateAmount
  };

  return result;
};

// ==============================|| MISSION ORDER ADD / EDIT / DELETE ||============================== //

const UpsertMissionOrder = ({ missionOrderId }) => {
  const { keycloak } = useKeycloak();

  const [missionOrder, setMissionOrder] = useState(null);

  const [contractors, setContractors] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [missions, setMissions] = useState([]);

  const navigate = useNavigate();

  const theme = useTheme();
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
  }, []);

  useEffect(() => {
    (async () => {
      if (missionOrderId) {
        await bindMissionOrder();
      }
    })();
  }, [missionOrderId]);

  useEffect(() => {
    (async () => {
      await bindMissions(missionOrder?.employerId);
    })();
  }, [missionOrder?.employerId]);

  const MissionSchema = Yup.object().shape({
    contractorId: Yup.string().required('Talent is required').nullable(true),
    employerId: Yup.string().required('Company is required').nullable(true),
    missionId: Yup.string().required('Mission is required').nullable(true),

    contractorServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    contractorServiceOrderDurationHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(999999, "Maximum 999999").nullable(true),
    contractorServiceOrderRateType: Yup.string().max(255).required('Required').nullable(true),
    contractorServiceOrderRateAmount: Yup.number("Should be a positive integer").integer("Should be a positive integer").required("Required").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true),

    employerServiceOrderDescription: Yup.string().max(5000).required('Required').nullable(true),
    employerServiceOrderDurationHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(999999, "Maximum 999999").nullable(true),
    employerServiceOrderRateType: Yup.string().max(255).required('Required').nullable(true),
    employerServiceOrderRateAmount: Yup.number("Should be a positive integer").integer("Should be a positive integer").required("Required").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(missionOrder),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = {
          contractorId: values.contractorId,
          employerId: values.employerId,
          missionId: values.missionId,

          contractorServiceOrder: {
            description: values.contractorServiceOrderDescription,
            durationHours: values.contractorServiceOrderDurationHours,
            rateType: values.contractorServiceOrderRateType,
            rateAmount: values.contractorServiceOrderRateAmount
          },

          employerServiceOrder: {
            description: values.employerServiceOrderDescription,
            durationHours: values.employerServiceOrderDurationHours,
            rateType: values.employerServiceOrderRateType,
            rateAmount: values.employerServiceOrderRateAmount
          }
        };

        if (missionOrder) {

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

          navigate('/orders/my');

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

        } else {
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

          navigate('/orders/my');

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

        }

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const getContractorServiceOrderDescription = (description) => {
    if (description)
      return description;

    return `<ul>
  <li>Start: week commencing {{startDate}} for {{durationMonths}} months.</li>
  <li>All Fees are in Euro and are excluding VAT.</li>
  <li>Payments are due as soon as the payment from the customer is received.</li>
  <li>This proposal is subject to the <a href="https://10x.team/10x-talent-terms-of-service/" target="_blank">10x Terms of Service</a> and <a href="https://10x.team/privacypolicy/" target="_blank">Privacy Statement</a>.</li>
</ul>`;
  }

  const getEmployerServiceOrderDescription = (description) => {

    if (description)
      return description;

    return `<ul>
  <li>Start: week commencing {{startDate}} for {{durationMonths}} months.</li>
  <li>All Fees are in Euro and are excluding VAT.</li>
  <li>Payments are due within 14 days after the date of the invoice.</li>
  <li>This proposal is valid until 7 days after the proposal date.</li>
  <li>Invoice schedule: 75% in advance, 25% afterwards.</li>
  <li>This proposal is subject to the <a href="https://10x.team/10x-client-terms-of-service/" target="_blank">10x Terms of Service</a>.</li>
</ul>`;
  }

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthrozied</Typography>

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {!missionOrder &&
            <>
              <DialogTitle>Create Mission Order</DialogTitle>
              <Divider />
            </>
          }

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

              <Grid item xs={12}>
                <Typography variant="h5">Company Service Order</Typography>
              </Grid>
              <Grid item xs={12}
                sx={{
                  '& .quill': {
                    borderRadius: '4px',
                    '& .ql-toolbar': {
                      bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                      borderColor: theme.palette.divider,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px'
                    },
                    '& .ql-container': {
                      borderColor: `${theme.palette.divider} !important`,
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      '& .ql-editor': {
                        minHeight: 135
                      }
                    }
                  }
                }}
              >
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_employer_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-employer-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="mission-order-employer-service-order-description"
                    value={getEmployerServiceOrderDescription(values.employerServiceOrderDescription)}
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
                    value={normalizeInputValue(values.employerServiceOrderRateType)}
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
                    type="number"
                    inputProps={{ min: 0, max: 999999 }}
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
                  <InfoWrapper tooltipText="mission_order_employer_service_order_duration_hours_tooltip">
                    <InputLabel htmlFor="employer-service-order-duration-hours">Effort</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="employer-service-order-duration-hours"
                    type="number"
                    inputProps={{ min: 0, max: 999999 }}
                    placeholder="Enter duration hours"
                    value={normalizeInputValue(values.employerServiceOrderDurationHours)}
                    name="employerServiceOrderDurationHours"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.employerServiceOrderDurationHours && errors.employerServiceOrderDurationHours && (
                    <FormHelperText error id="employer-service-order-duration-hours-helper">
                      {errors.employerServiceOrderDurationHours}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Talent Service Order</Typography>
              </Grid>
              <Grid item xs={12}
                sx={{
                  '& .quill': {
                    borderRadius: '4px',
                    '& .ql-toolbar': {
                      bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                      borderColor: theme.palette.divider,
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px'
                    },
                    '& .ql-container': {
                      borderColor: `${theme.palette.divider} !important`,
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      '& .ql-editor': {
                        minHeight: 135
                      }
                    }
                  }
                }}
              >
                <Stack spacing={1.25}>
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-contractor-service-order-description">Purchase Terms</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="mission-order-contractor-service-order-description"
                    value={getContractorServiceOrderDescription(values.contractorServiceOrderDescription)}
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
                    value={normalizeInputValue(values.contractorServiceOrderRateType)}
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
                    type="number"
                    inputProps={{ min: 0, max: 999999 }}
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
                  <InfoWrapper tooltipText="mission_order_contractor_service_order_duration_hours_tooltip">
                    <InputLabel htmlFor="contractor-service-order-duration-hours">Effort</InputLabel>
                  </InfoWrapper>
                  <TextField
                    fullWidth
                    id="contractor-service-order-duration-hours"
                    type="number"
                    inputProps={{ min: 0, max: 999999 }}
                    placeholder="Enter duration hours"
                    value={normalizeInputValue(values.contractorServiceOrderDurationHours)}
                    name="contractorServiceOrderDurationHours"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.contractorServiceOrderDurationHours && errors.contractorServiceOrderDurationHours && (
                    <FormHelperText error id="contractor-service-order-duration-hours-helper">
                      {errors.contractorServiceOrderDurationHours}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button color="error" onClick={() => { navigate('/orders/my'); }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {missionOrder ? 'Update' : 'Create'}
              </Button>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

UpsertMissionOrder.propTypes = {
  missionId: PropTypes.any
};

export default UpsertMissionOrder;
