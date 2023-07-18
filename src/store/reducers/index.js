// third-party
import { combineReducers } from 'redux';

// project import
import chat from './chat';
import menu from './menu';
import snackbar from './snackbar';
import calendar from './calendar';
import personalInformation from './personalInformation';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  chat,
  menu,
  snackbar,
  calendar,
  personalInformation
});

export default reducers;
