import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import update from 'immutability-helper';
import * as dayjs from 'dayjs';
import { openSnackbar } from 'store/reducers/snackbar';

import { Button, Stack, Typography, Grid, InputLabel, TextField, Tooltip, Autocomplete } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers';
import { startOfWeek, endOfWeek, subDays, addDays, format } from 'date-fns'
import { prepareApiBody } from 'utils/stringUtils';
import { getDatesInRange } from 'utils/dateUtils';

import {
  LeftCircleOutlined,
  RightCircleOutlined,
  DeleteFilled
} from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

// project import
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

const MissionTimeTrackingPage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const today = new Date();
  const [week, setWeek] = useState({ start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) });
  const [totalsPerDate, setTotalsPerDate] = useState(null);
  const [timeLogs, setTimeLogs] = useState([{ missionId: null }]);
  const [missions, setMissions] = useState(null);

  const getMissionOptions = (missionId) => {
    if (!missions)
      return [];

    let result = missions.filter(m => !timeLogs?.some(tl => tl.missionId == m.id));
    if (missionId && !result.some(x => x.id == missionId)) {
      result.push(missions.find(x => x.id == missionId));
    }

    return result;
  }

  const convertApiResponseToTimeLogs = (timeLogsResponse) => {
    let result = timeLogsResponse?.timeLogs?.reduce((groupsSoFar, { missionId, date, minutes }) => {
      let dateObject = new Date(date);
      let existingGroup = groupsSoFar.find(x => x.missionId === missionId);

      if (!existingGroup) {
        let newGroup = { missionId, days: [] };
        let datesInWeek = getDatesInRange(week.start, week.end);
        datesInWeek.map((dateInWeek) => {
          let newMinutes = dateInWeek.getTime() === dateObject.getTime() ? minutes : null;
          newGroup.days.push({ date: new Date(dateInWeek), minutes: newMinutes, time: getDayjsFromMinutes(newMinutes) });
        });

        groupsSoFar.push(newGroup);
      } else {
        let existingDay = existingGroup.days.find(x => x.date.getTime() === dateObject.getTime());
        if (existingDay) {
          existingDay.minutes = minutes;
          existingDay.time = getDayjsFromMinutes(minutes);
        }
      }
      return groupsSoFar;
    }, []);

    if (result.length < 1) {
      let emptyRow = createEmptyRow();
      result.push(emptyRow);
    }

    return result;
  }

  const getDayjsFromMinutes = (minutes) => {
    var hoursMinutes = getHoursMinutes(minutes);
    if (!hoursMinutes)
      return null;

    var date = new Date();
    date.setHours(hoursMinutes.hours);
    date.setMinutes(hoursMinutes.minutes);

    var result = dayjs(date);

    return result;
  }

  const createEmptyRow = () => {
    let result = { missionId: null, days: [] };

    let datesInWeek = getDatesInRange(week.start, week.end);
    datesInWeek.map((dateInWeek) => {
      result.days.push({ date: new Date(dateInWeek), minutes: null, time: null });
    });

    return result;
  }

  const bindTimeLogs = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/time-logs?startDate=' + format(week.start, 'yyyy-MM-dd') + '&endDate=' + format(week.end, 'yyyy-MM-dd'),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();

      const convertedTimeLogs = convertApiResponseToTimeLogs(json);
      setTimeLogs(convertedTimeLogs);
    } catch (error) {
      console.log(error);
    }
  }

  const bindMissions = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/time-logs/missions',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();
      setMissions(json?.missions);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindTimeLogs();
    })();
  }, [week]);

  useEffect(() => {
    (() => {
      let newTotalsPerDate = [];
      timeLogs?.map((timeLog) => {
        timeLog?.days?.map((timeLogDay) => {
          let foundDate = newTotalsPerDate.find(x => x.date.getTime() === timeLogDay.date.getTime());
          if (foundDate) {
            if (timeLogDay.minutes && timeLogDay.minutes > 0) {
              foundDate.total += timeLogDay.minutes;
              foundDate.totalFormattedString = getTimeStringFromMinutes(foundDate.total);
            }
          } else {
            newTotalsPerDate.push({ date: new Date(timeLogDay.date), total: timeLogDay.minutes, totalFormattedString: getTimeStringFromMinutes(timeLogDay.minutes) });
          }
        });
      })

      setTotalsPerDate(newTotalsPerDate);
    })();
  }, [timeLogs]);

  useEffect(() => {
    (async () => {
      await bindMissions();
    })();
  }, []);

  const getHoursMinutes = (minutesInt) => {
    if (!minutesInt && minutesInt != 0)
      return null;

    if (minutesInt < 0)
      return 0;

    let hours = parseInt(minutesInt / 60);
    let minutes = minutesInt - (hours * 60);

    var result = { hours, minutes };
    return result;
  }

  const getTimeStringFromMinutes = (minutesInt) => {
    let hoursMinutes = getHoursMinutes(minutesInt);
    if (!hoursMinutes)
      return '00:00';

    let result = hoursMinutes.hours.toString().padStart(2, '0') + ':' + hoursMinutes.minutes.toString().padStart(2, '0');

    return result;
  }

  const handlePreviousWeekClick = () => {
    let weekStart = subDays(week.start, 7);
    let weekEnd = subDays(week.end, 7);

    setWeek({ start: weekStart, end: weekEnd });
  }

  const handleNextWeekClick = () => {
    let weekStart = addDays(week.start, 7);
    let weekEnd = addDays(week.end, 7);

    setWeek({ start: weekStart, end: weekEnd });
  }

  const prepareTimeLogsUpdateRequest = () => {
    var result = { startDate: week.start, endDate: week.end, timeLogs: [] };

    timeLogs.map((timeLog) => {
      if (timeLog.missionId) {
        timeLog.days.map((timeLogDay) => {
          if (timeLogDay.minutes) {
            result.timeLogs.push({ missionId: timeLog.missionId, date: timeLogDay.date, minutes: timeLogDay.minutes });
          }
        });
      }
    });

    return result;
  }

  const handleAddRowClick = () => {
    let newRow = createEmptyRow();
    let newTimeLogs = [...timeLogs, newRow];

    setTimeLogs(newTimeLogs);
  }

  const handleRemoveRowClick = (index) => {
    var newTimeLogs = update(timeLogs, { $splice: [[index, 1]] });
    setTimeLogs(newTimeLogs);
  }

  const handleSaveClick = async () => {
    try {
      var requestBody = prepareTimeLogsUpdateRequest();

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/time-logs',
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

        return;
      }

      let json = await response.json();

      const convertedTimeLogs = convertApiResponseToTimeLogs(json);

      setTimeLogs(convertedTimeLogs);

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

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner title="Efficient Time Tracking" subTitle=" Seamlessly Log Your Work Hours with 10x" />
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            Welcome to our Time Tracking module designed to streamline your work process and accurately record your hours. With our simple system,
            you can effortlessly track the time you invest in each mission, add a mission by clicking the ‘Add Timesheet Row’, ensuring transparent and precise records.
            Boost your productivity by staying organized and maintaining a clear overview of your tasks. Experience the convenience of hassle-free time management
            that empowers you to focus on what truly matters – delivering exceptional results. Start logging your hours today and elevate your fractional journey with 10x!
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Track Time</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button onClick={handlePreviousWeekClick} variant="outlined" startIcon={<LeftCircleOutlined />}>Previous</Button>
            <Typography>{format(week?.start, 'iii, dd MMM y')} - {format(week?.end, 'iii, dd MMM y')}</Typography>
            <Button onClick={handleNextWeekClick} variant="outlined" endIcon={<RightCircleOutlined />}>Next</Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <MainCard sx={{ background: 'none', border: 'none' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={5}>
                    <Stack spacing={1.25}>
                      <InputLabel>&nbsp;</InputLabel>
                      <Typography variant="h3">Total</Typography>
                    </Stack>
                  </Grid>
                  {totalsPerDate?.map((totalPerDate, totalPerDateIndex) =>
                    <Grid key={totalPerDateIndex} item xs={4} lg={1}>
                      <Stack spacing={1.25}>
                        <InputLabel>{format(totalPerDate?.date, 'iii, dd MMM')}</InputLabel>
                        <Typography variant="h4">{totalPerDate?.totalFormattedString}</Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </MainCard>
            </Grid>
            {timeLogs?.map((timeLog, timeLogIndex) => {
              return (
                <Grid key={timeLogIndex} item xs={12}>
                  <MainCard>

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={5}>
                        <Stack spacing={1.25}>
                          <InputLabel>Mission</InputLabel>
                          <Autocomplete
                            fullWidth
                            value={missions?.find(x => x.id == timeLog?.missionId) ?? null}
                            options={getMissionOptions(timeLog?.missionId)}
                            getOptionLabel={(option) => option?.title}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(event, newValue) => {
                              var newTimeLogs = timeLogs.map((currentTimeLog, currentTimeLogIndex) => {
                                if (currentTimeLogIndex === timeLogIndex) {
                                  return {
                                    ...currentTimeLog,
                                    missionId: newValue?.id,
                                  };
                                }

                                return currentTimeLog;
                              });

                              setTimeLogs(newTimeLogs);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select a mission"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password' // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        </Stack>
                      </Grid>
                      {timeLog?.days?.map((timeLogDay, timeLogDayIndex) => (
                        <Grid key={timeLogDayIndex} item xs={4} lg={1}>
                          <Stack spacing={1.25}>
                            <InputLabel>{format(timeLogDay?.date, 'iii, dd MMM')}</InputLabel>
                            <TimeField
                              fullWidth
                              format="HH:mm"
                              ampm={false}
                              value={timeLogDay?.time}
                              onChange={(value) => {
                                var newTimeLogs = update(timeLogs, {
                                  [timeLogIndex]: {
                                    "days": {
                                      [timeLogDayIndex]: {
                                        "time": {
                                          $set: value
                                        },
                                        "minutes": {
                                          $set: (value?.$H ? value.$H : null) * 60 + (value?.$m ? value.$m : null)
                                        }
                                      }
                                    }
                                  }
                                });

                                setTimeLogs(newTimeLogs);
                              }}
                            />
                          </Stack>
                        </Grid>
                      ))}

                      <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                          <Tooltip title="Remove row" placement="top">
                            <IconButton onClick={() => { handleRemoveRowClick(timeLogIndex); }} size="large" color="error">
                              <DeleteFilled />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Grid>

                    </Grid>
                  </MainCard>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button variant="text" onClick={handleAddRowClick}>
                Add Timesheet Row
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleSaveClick}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </LocalizationProvider>
  );
};

export default MissionTimeTrackingPage;
