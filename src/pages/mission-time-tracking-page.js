import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import update from 'immutability-helper';
import { openSnackbar } from 'store/reducers/snackbar';

import {
  Button, Stack, Typography, Grid, InputLabel, TextField, Tooltip, Autocomplete } from '@mui/material';
import { startOfWeek, endOfWeek, subDays, addDays, format } from 'date-fns'
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

import {
  LeftCircleOutlined,
  RightCircleOutlined,
  DeleteFilled
} from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

// project import
import MainCard from 'components/MainCard';

const MissionTimeTrackingPage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const today = new Date();
  const [week, setWeek] = useState({ start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) });
  const [timeLogs, setTimeLogs] = useState([{ missionId: null }]);
  const [missions, setMissions] = useState(null);

  const convertApiResponseToTimeLogs = (timeLogsResponse) => {
    let result = timeLogsResponse?.timeLogs?.reduce((groupsSoFar, { missionId, date, minutes }) => {
      let dateObject = new Date(date);
      let existingGroup = groupsSoFar.find(x => x.missionId === missionId);
      if (!existingGroup) {
        let newGroup = { missionId, days: [] };
        for (var weekDate = new Date(week.start); weekDate <= week.end; weekDate.setDate(weekDate.getDate() + 1)) {
          let newMinutes = weekDate.getTime() === dateObject.getTime() ? minutes : null;

          newGroup.days.push({ date: new Date(weekDate), minutes: newMinutes });
        }
        groupsSoFar.push(newGroup);
      } else {
        let existingDay = existingGroup.days.find(x => x.date.getTime() === dateObject.getTime());
        if (existingDay)
          existingDay.minutes = minutes;
      }
      return groupsSoFar;
    }, []);

    if (result.length < 1) {
      let emptyRow = createEmptyRow();
      result.push(emptyRow);
    }

    return result;
  }
  const createEmptyRow = () => {
    let result = { missionId: null, days: [] };

    let startWeekDate = new Date(week.start);
    let endWeekDate = new Date(week.end);

    for (var weekDate = startWeekDate; weekDate <= endWeekDate; weekDate.setDate(weekDate.getDate() + 1)) {
      result.days.push({ date: new Date(weekDate), minutes: null });
    }

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
    (async () => {
      await bindMissions();
    })();
  }, []);

  const handlePreviousWeekClick = () => {
    setWeek({ start: subDays(week.start, 7), end: subDays(week.end, 7) });
  }

  const handleNextWeekClick = () => {
    setWeek({ start: addDays(week.start, 7), end: addDays(week.end, 7) });
  }

  const prepareTimeLogsUpdateRequest = () => {
    var result = {startDate: week.start, endDate: week.end, timeLogs: []};

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
          message: 'Data updated.',
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button onClick={handlePreviousWeekClick} variant="outlined" startIcon={<LeftCircleOutlined />}>Previous</Button>
          <Typography>{format(week?.start, 'PP')} - {format(week?.end, 'PP')}</Typography>
          <Button onClick={handleNextWeekClick} variant="outlined" endIcon={<RightCircleOutlined />}>Next</Button>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {timeLogs?.map((timeLog, timeLogIndex) => {
            return (
              <Grid key={timeLogIndex} item xs={12}>
                <MainCard>
                  <Stack spacing={1.25}>

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={5}>
                        <Stack spacing={1.25}>
                          <InputLabel>Mission</InputLabel>
                          <Autocomplete
                            fullWidth
                            value={missions?.find(x => x.id == timeLog?.missionId) ?? null}
                            options={missions ?? []}
                            getOptionLabel={(option) => option?.title}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            onChange={(event, newValue) => {
                              var newTimeLogs = timeLogs.map((currentTimeLog, currentTimeLogIndex) => {
                                if (currentTimeLogIndex === timeLogIndex) {
                                  return {
                                    ...currentTimeLog,
                                    missionId: newValue.id,
                                  };
                                }

                                return currentTimeLog;
                              });

                              setTimeLogs(newTimeLogs);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Choose a mission"
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
                            <InputLabel>{format(timeLogDay?.date, 'PP')}</InputLabel>
                            <TextField
                              fullWidth
                              type="number"
                              value={normalizeInputValue(timeLogDay?.minutes)}
                              onChange={(event) => {
                                var newTimeLogs = update(timeLogs, {
                                  [timeLogIndex]: {
                                    "days": {
                                      [timeLogDayIndex]: {
                                        "minutes": {
                                          $set: event.target.value
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
                    </Grid>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                      <Tooltip title="Remove row" placement="top">
                        <IconButton onClick={() => { handleRemoveRowClick(timeLogIndex); }} size="large" color="error">
                          <DeleteFilled />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

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
              Add Row
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
  );
};

export default MissionTimeTrackingPage;
