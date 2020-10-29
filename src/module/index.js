import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import databaseReducer, { databaseSaga } from './database';
import showReducer from './show';

export default combineReducers({
  database: databaseReducer,
  show: showReducer,
});

export function* rootSaga() {
  yield all([databaseSaga()]);
}
