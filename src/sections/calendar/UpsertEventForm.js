import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// material-ui
import {
  Button,
  FormHelperText,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Tooltip
} from '@mui/material';
import { LocalizationProvider, MobileDatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';
import { createEvent, deleteEvent, updateEvent } from 'store/reducers/calendar';

// assets
import { CalendarOutlined, DeleteFilled } from '@ant-design/icons';
import { normalizeBooleanInputValue } from 'utils/stringUtils';

// constant
const getInitialValues = (event, range) => {
  const newEvent = {
    notes: '',
    hasMonday: false,
    hasTuesday: false,
    hasWednesday: false,
    hasThursday: false,
    hasFriday: false,
    hasSaturday: false,
    hasSunday: false,
    startDate: range ? new Date(range.start) : new Date(),
    endDate: range ? new Date(range.end) : new Date(),
    startTime: '09:00:00',
    endTime: '17:30:00'
  };

  if (event || range) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const UpsertEventFrom = ({ event, range, onCancel }) => {
  const dispatch = useDispatch();
  const isCreating = !event;

  const EventSchema = Yup.object().shape({
    notes: Yup.string().max(5000),
    hasMonday: Yup.boolean().nullable(true),
    hasTuesday: Yup.boolean().nullable(true),
    hasWednesday: Yup.boolean().nullable(true),
    hasThrusday: Yup.boolean().nullable(true),
    hasFriday: Yup.boolean().nullable(true),
    hasSaturday: Yup.boolean().nullable(true),
    hasSunday: Yup.boolean().nullable(true),
    startDate: Yup.date().required('Start Date is required').nullable(true),
    endDate: Yup.date().required('End Date is required').when('startDate', (start, schema) => start && schema.min(start, 'End date must be later than start date')).nullable(true),
    startTime: Yup.string().required('Start Time is required').nullable(true),
    endTime: Yup.string().required('End Time is required').nullable(true),
  });

  const deleteHandler = () => {
    dispatch(deleteEvent(event?.id));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Event deleted successfully.',
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
          hasThrusday: values.hasThrusday,
          hasFriday: values.hasFriday,
          hasSaturday: values.hasSaturday,
          hasSunday: values.hasSunday,
          startDate: values.startDate,
          endDate: values.endDate,
          startTime: values.startTime,
          endTime: values.endTime
        };

        if (event) {
          dispatch(updateEvent(event.id, newEvent));
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
          dispatch(createEvent(newEvent));
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{event ? 'Edit Availability' : 'Add Availability'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
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

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="start-date">Start Date</InputLabel>
                  <MobileDatePicker
                    value={values.startDate}
                    inputFormat="yyyy-MM-dd"
                    onChange={(date) => setFieldValue('startDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="start-date"
                        placeholder="Start Date"
                        fullWidth
                        error={Boolean(touched.startDate && errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="end-date">End Date</InputLabel>
                  <MobileDatePicker
                    value={values.endDate}
                    inputFormat="yyyy-MM-dd"
                    onChange={(date) => setFieldValue('endDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="end-date"
                        placeholder="End Date"
                        fullWidth
                        error={Boolean(touched.endDate && errors.endDate)}
                        helperText={touched.endDate && errors.endDate}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarOutlined />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="start-time">Start Time</InputLabel>
                  <TimePicker
                    value={values.startTime}
                    onChange={(time) => setFieldValue('startTime', time)}
                    ampm={false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="start-time"
                        placeholder="Start Time"
                        fullWidth
                        error={Boolean(touched.startTime && errors.startTime)}
                        helperText={touched.startTime && errors.startTime}
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="end-time">End Time</InputLabel>
                  <TimePicker
                    value={values.endTime}
                    onChange={(time) => setFieldValue('endTime', time)}
                    ampm={false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="end-time"
                        placeholder="End Time"
                        fullWidth
                        error={Boolean(touched.endTime && errors.endTime)}
                        helperText={touched.endTime && errors.endTime}
                      />
                    )}
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
