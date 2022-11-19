import {combineReducers} from 'redux';

import authReducers from './auth';
import authentication from './authentication';
import contractReducers from './contract';

import errorPopUp from './errorPopUp';
import uiReducers from './ui';

const Reducers = combineReducers({
  auth: authReducers,
  contractReducer: contractReducers,
  ui: uiReducers,
  authentication: authentication,
  errorReducer: errorPopUp,
});

export default Reducers;
