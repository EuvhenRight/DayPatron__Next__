// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import personalInformation from './personalInformation';
import invoice from './invoice';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  personalInformation,
  invoice
});

export default reducers;
