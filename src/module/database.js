import { createAction, handleActions } from 'redux-actions';
import { takeLatest, call, put, select, delay } from 'redux-saga/effects';

import * as countryApi from '../api/country';
import * as selectors from './selectors';
import { showActions } from './show';

const OFFSET = 20;

// initial state
const initialState = {
  countries: [],
  nextId: 0,
  prevLastId: -1,
  totalLength: 0,
};

// action type
//.. 나라 정보 불러오는 api 사용해서 set
const SET_COUNTRIES_REQUEST = 'database/SET_COUNTRIES_REQUEST';
const SET_COUNTRIES_SUCCESS = 'database/SET_COUNTRIES_SUCCESS';

//.. country 정보 추가
const ADD_COUNTRY = 'database/ADD_COUNTRY';
const ADD_COUNTRY_IN_SAGA = 'database/ADD_COUNTRY_IN_SAGA';

//.. country 정보 show에 추가하기
const LOAD_COUNTRIES_REQUEST = 'database/LOAD_COUNTRIES_REQUEST';
const LOAD_COUNTRIES_SUCCESS = 'database/LOAD_COUNTRIES_SUCCESS';

// action creator
export const databaseActions = {
  setCountries: createAction(SET_COUNTRIES_REQUEST),
  addCountry: createAction(ADD_COUNTRY),
  loadCountries: createAction(LOAD_COUNTRIES_REQUEST),
};
const loadCountriesSuccess = createAction(LOAD_COUNTRIES_SUCCESS);
const countriesSuccess = createAction(SET_COUNTRIES_SUCCESS);
const addCountryInSaga = createAction(ADD_COUNTRY_IN_SAGA);

// saga
function* loadCountriesSaga(action) {
  console.log('loadCountriesSaga called');
  const totalLength = yield select(selectors.getTotalLength);
  const countries = yield select(selectors.getCountries);
  const prevNextId = yield select(selectors.getNextId);
  // const prevLastId = yield select(selectors.getPrevLastId);
  // console.log('prevLastId:', prevLastId);

  const limit = Math.min(prevNextId + OFFSET, totalLength);
  // const list = countries.slice(prevNextId, prevNextId + OFFSET);
  const list = countries.slice(prevNextId, limit);

  // yield put(loadCountriesSuccess(prevNextId + OFFSET)); // prevLastId음..필요할까?
  yield put(loadCountriesSuccess(limit)); // prevLastId음..필요할까?
  yield put(showActions.appendCountries(list));
}

// 나라 정보를 기본 세팅하는 [setCountries] 가 호출되었을 때 불리는 saga
function* setCountriesSaga(action) {
  console.log('setCountriesSaga called');
  const { data } = yield call(countryApi.get);
  yield put(countriesSuccess(data));
  yield put(showActions.setCountries(data.slice(0, 20)));
  // show의 countries 초기화
}

// 새로운 나라 정보를 추가하는 [addCountry]가 호출되었을 때 불리는 saga
function* addCountrySaga(action) {
  console.log('addCountrySaga called');
  const { newCountry } = action.payload;
  const prevNextId = yield select(selectors.getNextId);
  newCountry.id = prevNextId;
  yield put(addCountryInSaga(newCountry));
  yield put(showActions.appendCountry(prevNextId));
}

// 합쳐서 내보내는 saga
export function* databaseSaga(action) {
  yield takeLatest(SET_COUNTRIES_REQUEST, setCountriesSaga);
  yield takeLatest(ADD_COUNTRY, addCountrySaga);
  yield takeLatest(LOAD_COUNTRIES_REQUEST, loadCountriesSaga);
}

// reducer
const databaseReducer = handleActions(
  {
    [LOAD_COUNTRIES_SUCCESS]: (prevState, action) => ({
      ...prevState,
      nextId: action.payload,
    }),
    [SET_COUNTRIES_SUCCESS]: (prevState, action) => ({
      ...prevState,
      prevLastId: OFFSET,
      nextId: OFFSET + 1,
      countries: action.payload,
      totalLength: action.payload.length,
    }),

    [ADD_COUNTRY_IN_SAGA]: (prevState, action) => ({
      ...prevState,
      countries: [...prevState.countries, action.payload],
      totalLength: prevState.totalLength + 1,
      // nextId: prevState.nextId + 1 해야 하나?
    }),
  },
  initialState
);

export default databaseReducer;