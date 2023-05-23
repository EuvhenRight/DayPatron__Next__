import { createSlice } from '@reduxjs/toolkit';

// project import
import axios from 'utils/axios';
import { dispatch, store } from 'store';

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
      startTime: event.startTime,
      endTime: event.endTime,
      startRecur: event.startDate,
      endRecur: event.endDate,
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
      console.log(eventId);
      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },

    // select date range
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isModalOpen = true;
      state.selectedRange = { start, end };
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

export function getEvents(keycloak) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.get(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/availability',
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));

      /*var events = [
        {
          id: 'avl1',
          notes: 'Availability notes 1',
          hasMonday: true,
          hasTuesday: true,
          hasWednesday: true,
          hasThursday: true,
          hasFriday: true,
          hasSaturday: true,
          hasSunday: false,
          startTime: '09:00:00',
          endTime: '18:00:00',
          startDate: '2023-05-01',
          endDate: '2023-05-15'
        },
        {
          id: 'avl2',
          notes: 'Availability notes 2',
          hasMonday: true,
          hasTuesday: true,
          hasWednesday: true,
          hasThursday: true,
          hasFriday: true,
          hasSaturday: true,
          hasSunday: false,
          startTime: '09:00:00',
          endTime: '18:00:00',
          startDate: '2023-05-16',
          endDate: '2023-05-22'
        }
      ];
      dispatch(calendar.actions.setEvents(events));*/
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function createEvent(newEvent, keycloak) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      var newEvents = [...store.getState().calendar.events, newEvent];
      const response = await axios.put(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/availability',
        { periods: newEvents },
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function updateEvent(eventId, updateEvent, keycloak) {
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
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/availability',
        { periods: newEvents },
        { headers: { Authorization: 'Bearer ' + keycloak.idToken } }
      );
      dispatch(calendar.actions.setEvents(response.data.periods));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function deleteEvent(eventId, keycloak) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const newEvents = store.getState().calendar.events.filter((event) => event.id !== eventId);
      const response = await axios.put(
        process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/availability',
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
