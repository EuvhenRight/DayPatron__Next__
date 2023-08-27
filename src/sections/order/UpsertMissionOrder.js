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
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

// constant
const getInitialValues = (missionOrder) => {
  const newMissionOrder = {
    id: null,
    contractorId: null,
    employerId: null,
    missionId: null,
    contractorServiceOrderDescription: null,
  };

  if (missionOrder) {
    var result = _.merge({}, newMissionOrder, missionOrder);
    
    return result;
  }

  return newMissionOrder;
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

  const bindMissionOrder = async () => {
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

      setMissionOrder(json);
    } catch (error) {
      console.log(error);
    }
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
  }, [missions]);

  const MissionSchema = Yup.object().shape({
    contractorId: Yup.string().required('Talent is required').nullable(true),
    employerId: Yup.string().required('Company is required').nullable(true),
    missionId: Yup.string().required('Mission is required').nullable(true),
    contractorServiceOrderDescription: Yup.string().max(5000).required('Description is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(missionOrder),
    validationSchema: MissionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

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
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders',
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

  const { errors, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

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
                  <InfoWrapper tooltipText="mission_order_talent_tooltip">
                    <InputLabel>Talent</InputLabel>
                  </InfoWrapper>

                  <Select
                    id="contractorId"
                    name="contractorId"
                    displayEmpty
                    value={normalizeInputValue(values.contractorId)}
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
                  <InfoWrapper tooltipText="mission_order_company_tooltip">
                    <InputLabel>Company</InputLabel>
                  </InfoWrapper>

                  <Select
                    id="employerId"
                    name="employerId"
                    displayEmpty
                    value={normalizeInputValue(values.employerId)}
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
                    value={normalizeInputValue(values.missionId)}
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
                  <InfoWrapper tooltipText="mission_order_talent_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-talent-service-order-description">Talent Service Order Description</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="mission-order-talent-service-order-description"
                    value={normalizeInputValue(values.contractorServiceOrderDescription)}
                    onChange={(e) => setFieldValue('contractorServiceOrderDescription', e)}
                  />
                  {touched.contractorServiceOrderDescription && errors.contractorServiceOrderDescription && (
                    <FormHelperText error id="mission-order-talent-service-order-description-helper">
                      {errors.contractorServiceOrderDescription}
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
                  <InfoWrapper tooltipText="mission_order_company_service_order_description_tooltip">
                    <InputLabel htmlFor="mission-order-company-service-order-description">Company Service Order Description</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="mission-order-company-service-order-description"
                    value={normalizeInputValue(values.employerServiceOrderDescription)}
                    onChange={(e) => setFieldValue('employerServiceOrderDescription', e)}
                  />
                  {touched.employerServiceOrderDescription && errors.employerServiceOrderDescription && (
                    <FormHelperText error id="mission-order-company-service-order-description-helper">
                      {errors.employerServiceOrderDescription}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Project Order</Typography>
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
                  <InfoWrapper tooltipText="project_order_description_tooltip">
                    <InputLabel htmlFor="project_order-description">Project Order Description</InputLabel>
                  </InfoWrapper>
                  <ReactQuill
                    id="project-order-description"
                    value={normalizeInputValue(values.projectOrderDescription)}
                    onChange={(e) => setFieldValue('projectOrderDescription', e)}
                  />
                  {touched.projectOrderDescription && errors.projectOrderDescription && (
                    <FormHelperText error id="project-order-description-helper">
                      {errors.projectOrderDescription}
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
