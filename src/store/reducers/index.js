// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import personalInformation from './personalInformation';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  personalInformation
});

export default reducers;
