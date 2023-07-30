import { createSlice } from '@reduxjs/toolkit';
import { addDays, subDays } from 'date-fns';

// project import
import axios from 'axios';
import { dispatch, store } from 'store';
import { dateTimeToTimeString } from 'utils/stringUtils';

const initialState = {
  calendarView: 'dayGridMonth',
  error: false,
  events: [],
  fcEvents: [],
  isLoader: false,
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

const convertAvailabilityToFullCalendarEvents = (events) => {
  var result = events.map((event) => {
    var daysOfWeek = [];
    if (event.hasMonday)
      daysOfWeek.push(1);
    if (event.hasTuesday)
      daysOfWeek.push(2);
    if (event.hasWednesday)
      daysOfWeek.push(3);
    if (event.hasThursday)
      daysOfWeek.push(4);
    if (event.hasFriday)
      daysOfWeek.push(5);
    if (event.hasSaturday)
      daysOfWeek.push(6);
    if (event.hasSunday)
      daysOfWeek.push(7);

    return {
      id: event.id,
      title: 'Available',
      description: event.notes,
      daysOfWeek: daysOfWeek,
      startTime: dateTimeToTimeString(event.startTime),
      endTime: dateTimeToTimeString(event.endTime),
      startRecur: event.startDate,
      endRecur: addDays(new Date(event.endDate), 1).toISOString(),
      allDay: false
    };
  });

  return result;
};

// ==============================|| CALENDAR - SLICE ||============================== //

const calendar = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // loader
    loading(state) {
      state.isLoader = true;
    },

    // error
    hasError(state, action) {
      state.isLoader = false;
      state.error = action.payload;
    },

    // event list
    setEvents(state, action) {
      state.isLoader = false;
      state.isModalOpen = false;
      state.events = action.payload;
      state.fcEvents = convertAvailabilityToFullCalendarEvents(state.events);
    },

    // update calendar view
    updateCalendarView(state, action) {
      state.calendarView = action.payload;
    },

    // select event
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },

    // select date range
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end: subDays(new Date(end), 1).valueOf() };
    },

    // modal toggle
    toggleModal(state) {
      state.isModalOpen = !state.isModalOpen;
      if (state.isModalOpen === false) {
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    }
  }
});

export default calendar.reducer;

export const { selectEvent, toggleModal, updateCalendarView } = calendar.actions;

export function getEvents(keycloak, contractorId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      console.log(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId) + '/availability');
      const response = await axios.get(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId) + '/availability',
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );

      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function createEvent(newEvent, keycloak, contractorId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      var newEvents = [...store.getState().calendar.events, newEvent];
      const response = await axios.put(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId) + '/availability',
        { periods: newEvents },
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function updateEvent(eventId, updateEvent, keycloak, contractorId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const newEvents = store.getState().calendar.events.map((item) => {
        if (item.id === eventId) {
          return updateEvent;
        }
        return item;
      });
      const response = await axios.put(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId) + '/availability',
        { periods: newEvents },
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function deleteEvent(eventId, keycloak, contractorId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const newEvents = store.getState().calendar.events.filter((event) => event.id !== eventId);
      const response = await axios.put(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(contractorId) + '/availability',
        { periods: newEvents },
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function selectRange(start, end) {
  return async () => {
    dispatch(
      calendar.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
