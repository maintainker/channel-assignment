import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import databaseReducer, { databaseSaga } from './database';
import showReducer from './show';
import searchReducer, { searchSaga } from './search';

export default combineReducers({
  database: databaseReducer,
  show: showReducer,
  search: searchReducer,
});

export function* rootSaga() {
  yield all([databaseSaga(), searchSaga()]);
}
