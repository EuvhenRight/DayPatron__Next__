// third-party
import { combineReducers } from 'redux';

// project import
import chat from './chat';
import menu from './menu';
import snackbar from './snackbar';
import calendar from './calendar';
import invoice from './invoice';
import personalInformation from './personalInformation';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  chat,
  menu,
  snackbar,
  calendar,
  invoice,
  personalInformation
});

export default reducers;
