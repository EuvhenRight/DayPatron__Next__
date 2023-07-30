import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as dayjs from 'dayjs';

// material-ui
import {
  Button,
  FormHelperText,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Tooltip
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';
import { createEvent, deleteEvent, updateEvent } from 'store/reducers/calendar';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { normalizeBooleanInputValue } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

// constant
const getInitialValues = (event, range) => {
  let eventClone = {...event};
  if (eventClone?.startDate)
    eventClone.startDate = dayjs(eventClone.startDate);

  if (eventClone?.endDate)
    eventClone.endDate = dayjs(eventClone.endDate);

  const newEvent = {
    notes: 'I am available in this period',
    hasMonday: true,
    hasTuesday: true,
    hasWednesday: true,
    hasThursday: true,
    hasFriday: true,
    hasSaturday: false,
    hasSunday: false,
    startDate: range ? dayjs(new Date(range.start)) : dayjs(new Date()),
    endDate: range ? dayjs(new Date(range.end)) : dayjs(new Date())
  };

  if (event || range) {
    return _.merge({}, newEvent, eventClone);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const UpsertEventFrom = ({ event, range, onCancel }) => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const dispatch = useDispatch();
  const isCreating = !event;

  const EventSchema = Yup.object().shape({
    notes: Yup.string().max(5000),
    hasMonday: Yup.boolean().nullable(true),
    hasTuesday: Yup.boolean().nullable(true),
    hasWednesday: Yup.boolean().nullable(true),
    hasThursday: Yup.boolean().nullable(true),
    hasFriday: Yup.boolean().nullable(true),
    hasSaturday: Yup.boolean().nullable(true),
    hasSunday: Yup.boolean().nullable(true),
    startDate: Yup.date().required('Start Date is required').nullable(true),
    endDate: Yup.date().required('End Date is required').when('startDate', (start, schema) => start && schema.min(start, 'End date must be later than start date')).nullable(true)
  });

  const deleteHandler = () => {
    dispatch(deleteEvent(event?.id, keycloak, personalInformation.id));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Avilability deleted successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const newEvent = {
          notes: values.notes,
          hasMonday: values.hasMonday,
          hasTuesday: values.hasTuesday,
          hasWednesday: values.hasWednesday,
          hasThursday: values.hasThursday,
          hasFriday: values.hasFriday,
          hasSaturday: values.hasSaturday,
          hasSunday: values.hasSunday,
          startDate: values.startDate,
          endDate: values.endDate
        };

        if (event) {
          dispatch(updateEvent(event.id, newEvent, keycloak, personalInformation.id));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Availability updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          dispatch(createEvent(newEvent, keycloak, personalInformation.id));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Availability added successfully.',
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

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{event ? 'Edit Availability' : 'Add Availability'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="start-date">Start Date</InputLabel>
                  <DatePicker
                    value={values.startDate}
                    inputFormat="yyyy-MM-dd"
                    onChange={(date) => setFieldValue('startDate', date)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="end-date">End Date</InputLabel>
                  <DatePicker
                    value={values.endDate}
                    inputFormat="yyyy-MM-dd"
                    onChange={(date) => setFieldValue('endDate', date)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Grid justify="space-between" container spacing={5}>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-monday">Monday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-monday"
                          name="hasMonday"
                          checked={normalizeBooleanInputValue(values?.hasMonday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasMonday", checked);
                          }}
                        />
                        {touched.hasMonday && errors.hasMonday && (
                          <FormHelperText error id="has-monday-helper">
                            {errors.hasMonday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-tuesday">Tuesday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-tuesday"
                          name="hasTuesday"
                          checked={normalizeBooleanInputValue(values?.hasTuesday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasTuesday", checked);
                          }}
                        />
                        {touched.hasTuesday && errors.hasTuesday && (
                          <FormHelperText error id="has-tuesday-helper">
                            {errors.hasTuesday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-wednesday">Wednesday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-wednesday"
                          name="hasWednesday"
                          checked={normalizeBooleanInputValue(values?.hasWednesday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasWednesday", checked);
                          }}
                        />
                        {touched.hasWednesday && errors.hasWednesday && (
                          <FormHelperText error id="has-wednesday-helper">
                            {errors.hasWednesday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-thursday">Thursday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-thursday"
                          name="hasThursday"
                          checked={normalizeBooleanInputValue(values?.hasThursday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasThursday", checked);
                          }}
                        />
                        {touched.hasThursday && errors.hasThursday && (
                          <FormHelperText error id="has-thursday-helper">
                            {errors.hasThursday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-friday">Friday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-friday"
                          name="hasFriday"
                          checked={normalizeBooleanInputValue(values?.hasFriday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasFriday", checked);
                          }}
                        />
                        {touched.hasFriday && errors.hasFriday && (
                          <FormHelperText error id="has-friday-helper">
                            {errors.hasFriday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-saturday">Saturday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-saturday"
                          name="hasSaturday"
                          checked={normalizeBooleanInputValue(values?.hasSaturday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasSaturday", checked);
                          }}
                        />
                        {touched.hasSaturday && errors.hasSaturday && (
                          <FormHelperText error id="has-saturday-helper">
                            {errors.hasSaturday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="has-sunday">Sunday</InputLabel>
                      <Stack direction="row" alignItems="center">
                        <Switch
                          id="has-sunday"
                          name="hasSunday"
                          checked={normalizeBooleanInputValue(values?.hasSunday)}
                          onChange={(event, checked) => {
                            setFieldValue("hasSunday", checked);
                          }}
                        />
                        {touched.hasSunday && errors.hasSunday && (
                          <FormHelperText error id="has-sunday-helper">
                            {errors.hasSunday}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>  
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="notes">Notes</InputLabel>
                  <TextField
                    fullWidth
                    id="notes"
                    multiline
                    rows={3}
                    placeholder="Notes"
                    {...getFieldProps('notes')}
                    error={Boolean(touched.notes && errors.notes)}
                    helperText={touched.notes && errors.notes}
                  />
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Delete Availability" placement="top">
                    <IconButton onClick={deleteHandler} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {event ? 'Edit' : 'Add'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

UpsertEventFrom.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
};

export default UpsertEventFrom;
