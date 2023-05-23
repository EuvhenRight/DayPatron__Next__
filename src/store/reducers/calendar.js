import { createSlice } from '@reduxjs/toolkit';

// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

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
      endRecur: event.endDate
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

    // create event
    createEvent(state, action) {
      const newEvent = action.payload;
      state.isLoader = false;
      state.isModalOpen = false;
      state.events = [...state.events, newEvent];
      state.fcEvents = convertAvailabilityToFullCalendarEvents(state.events);
    },

    // update event
    updateEvent(state, action) {
      const event = action.payload;
      const eventUpdate = state.events.map((item) => {
        if (item.id === event.id) {
          return event;
        }
        return item;
      });

      state.isLoader = false;
      state.isModalOpen = false;
      state.events = eventUpdate;
      state.fcEvents = convertAvailabilityToFullCalendarEvents(state.events);
    },

    // delete event
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.isModalOpen = false;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
      state.events = deleteEvent;
      state.fcEvents = convertAvailabilityToFullCalendarEvents(state.events);
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

export function getEvents() {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      //const response = await axios.get('/api/calendar/events');
      //dispatch(calendar.actions.setEvents(response.data.events));
      var events = [
        {
          id: 'avl1',
          notes: 'Availability notes',
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
          endDate: '2023-05-22'
        }
      ];
      dispatch(calendar.actions.setEvents(events));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function createEvent(newEvent) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.post('/api/calendar/events/add', newEvent);
      dispatch(calendar.actions.createEvent(response.data.event));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function updateEvent(eventId, updateEvent) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        update: updateEvent
      });
      dispatch(calendar.actions.updateEvent(response.data.event));
    } catch (error) {
      dispatch(calendar.actions.hasError(error));
    }
  };
}

export function deleteEvent(eventId) {
  return async () => {
    dispatch(calendar.actions.loading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(calendar.actions.deleteEvent({ eventId }));
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
