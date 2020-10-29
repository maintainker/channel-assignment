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

//.. rollback
const ROLLBACK = 'database/ROLLBACK';

//.. remove
const REMOVE = 'database/REMOVE';
const REMOVE_SUCCESS = 'database/REMOVE_SUCCESS';

//.. add
const ADD = 'database/ADD';
const ADD_SUCCESS = 'database/ADD_SUCCESS';

// action creator
export const databaseActions = {
  setCountries: createAction(SET_COUNTRIES_REQUEST),
  addCountry: createAction(ADD_COUNTRY),
  loadCountries: createAction(LOAD_COUNTRIES_REQUEST),
  rollback: createAction(ROLLBACK),
  remove: createAction(REMOVE),
  add: createAction(ADD),
};

const addSuccess = createAction(ADD_SUCCESS);
const loadCountriesSuccess = createAction(LOAD_COUNTRIES_SUCCESS);
const countriesSuccess = createAction(SET_COUNTRIES_SUCCESS);
const addCountryInSaga = createAction(ADD_COUNTRY_IN_SAGA);
const removeSuccess = createAction(REMOVE_SUCCESS);

// saga
function* addSaga(action) {
  const { payload } = action;
  const subtract = (arr1, arr2) => arr2.filter(n => !arr1.includes(n));

  const countries = yield select(selectors.getCountries);
  const totalLength = yield select(selectors.getTotalLength);
  let isValidAdd = true;

  for (let i = 0; i < totalLength; i++) {
    const { name, alpha2Code, capital, region, callingCodes } = countries[i];
    if (
      name.toLowerCase() === payload.name.toLowerCase() ||
      alpha2Code.toLowerCase() === payload.alpha2Code.toLowerCase() ||
      capital.toLowerCase() === payload.capital.toLowerCase() ||
      region.toLowerCase() === payload.region.toLowerCase() ||
      payload.callingCodes.length >
        subtract(callingCodes, payload.callingCodes).length
    ) {
      alert('이미 있는 정보입니다');
      isValidAdd = false;
      break;
    }
  }

  if (isValidAdd) {
    alert('성공적으로 추가하였습니다');
    action.payload.id = totalLength;
    yield put(addSuccess(action.payload));
  }
}

function* removeSaga(action) {
  yield put(removeSuccess(action.payload));
  yield put(showActions.remove(action.payload));
}

function* rollbackSaga(action) {
  console.log('rollback합니다');
  const prevNextId = yield select(selectors.getNextId);

  const list = [];
  for (let i = 0; i < prevNextId; i++) {
    list.push(i);
  }

  yield put(showActions.setCountries(list));
}

function* loadCountriesSaga(action) {
  console.log('loadCountriesSaga called');
  const totalLength = yield select(selectors.getTotalLength);
  const countries = yield select(selectors.getCountries);
  const prevNextId = yield select(selectors.getNextId);
  // const prevLastId = yield select(selectors.getPrevLastId);
  // console.log('prevLastId:', prevLastId);

  const limit = Math.min(prevNextId + OFFSET, totalLength);
  // const list = countries.slice(prevNextId, prevNextId + OFFSET);
  // const list = countries.slice(prevNextId, limit);
  const list = [];
  for (let i = prevNextId; i < limit; i++) {
    list.push(i);
  }

  // yield put(loadCountriesSuccess(prevNextId + OFFSET)); // prevLastId음..필요할까?
  yield put(loadCountriesSuccess(limit)); // prevLastId음..필요할까?
  yield put(showActions.appendCountries(list));
}

// 나라 정보를 기본 세팅하는 [setCountries] 가 호출되었을 때 불리는 saga
function* setCountriesSaga(action) {
  console.log('setCountriesSaga called');
  const { data } = yield call(countryApi.get);
  const { length } = data;
  for (let i = 0; i < length; i++) {
    data[i].id = i;
  }
  yield put(countriesSuccess(data));

  // show의 countries 초기화
  const showList = [];
  for (let i = 0; i < OFFSET; i++) showList.push(i);
  yield put(showActions.setCountries(showList));
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
  yield takeLatest(ROLLBACK, rollbackSaga);
  yield takeLatest(REMOVE, removeSaga);
  yield takeLatest(ADD, addSaga);
}

// reducer
const databaseReducer = handleActions(
  {
    [ADD_SUCCESS]: (prevState, action) => ({
      ...prevState,
      countries: [...prevState.countries, action.payload],
      totalLength: prevState.totalLength + 1,
    }),
    [REMOVE_SUCCESS]: (prevState, action) => ({
      ...prevState,
      totalLength: prevState.totalLength - 1,
      countries: prevState.countries.filter(
        country => action.payload !== country.id
      ),
    }),
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
