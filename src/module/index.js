import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

export default combineReducers({});

export function* rootSaga() {
  yield all([]);
}
