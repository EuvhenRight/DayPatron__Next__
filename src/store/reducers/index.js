// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import personalInformation from './personalInformation';
import invoice from './invoice';
import loadingDetails from './loadingDetails';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  personalInformation,
  invoice,
  loadingDetails
});

export default reducers;
