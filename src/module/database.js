import { createAction, handleActions } from 'redux-actions';
import { takeLatest, call, put, select, delay } from 'redux-saga/effects';

import * as countryApi from '../api/country';
import * as selectors from './selectors';
import { showActions } from './show';

const OFFSET = 10;

// initial state
const initialState = {
  countries: [],
  nextId: 0,
  totalLength: 0,
  sort: {
    // asc, desc
    name: 'asc',
    alpha2Code: 'asc',
    capital: 'asc',
    region: 'asc',
    callingCodes: 'asc',
  },
};

// action type
//.. 나라 정보 불러오는 api 사용해서 set
const SET_COUNTRIES_REQUEST = 'database/SET_COUNTRIES_REQUEST';
const SET_COUNTRIES_SUCCESS = 'database/SET_COUNTRIES_SUCCESS';

//.. country 정보 추가
const ADD_COUNTRY = 'database/ADD_COUNTRY';
const ADD_COUNTRY_SUCCESS = 'database/ADD_COUNTRY_SUCCESS';

//.. country 정보 show에 추가하기
const LOAD_COUNTRIES_REQUEST = 'database/LOAD_COUNTRIES_REQUEST';
const LOAD_COUNTRIES_SUCCESS = 'database/LOAD_COUNTRIES_SUCCESS';

//.. rollback
const ROLLBACK = 'database/ROLLBACK';

//.. remove
const REMOVE_REQUEST = 'database/REMOVE_REQUEST';
const REMOVE_SUCCESS = 'database/REMOVE_SUCCESS';

//.. add
const ADD_REQUEST = 'database/ADD_REQUEST';
const ADD_SUCCESS = 'database/ADD_SUCCESS';

//... sort
const SET_SORT_STATUS_REQUEST = 'database/SET_SORT_STATUS_REQUEST';
const SET_SORT_STATUS_SUCCESS = 'database/SET_SORT_STATUS_SUCCESS';

// action creator
export const databaseActions = {
  setCountries: createAction(SET_COUNTRIES_REQUEST),
  addCountry: createAction(ADD_COUNTRY),
  loadCountries: createAction(LOAD_COUNTRIES_REQUEST),
  rollback: createAction(ROLLBACK),
  remove: createAction(REMOVE_REQUEST),
  add: createAction(ADD_REQUEST),
  setSortStatus: createAction(SET_SORT_STATUS_REQUEST),
};

const addSuccess = createAction(ADD_SUCCESS);
const loadCountriesSuccess = createAction(LOAD_COUNTRIES_SUCCESS);
const countriesSuccess = createAction(SET_COUNTRIES_SUCCESS);
const addCountrySuccess = createAction(ADD_COUNTRY_SUCCESS);
const removeSuccess = createAction(REMOVE_SUCCESS);
const setSortStatusSuccess = createAction(SET_SORT_STATUS_SUCCESS);

/* saga */
// 정렬하는 saga
// input: { sort할 key: sort 방향 } (ex. {alpha2Code: asc})
function* setSortStatusSaga(action) {
  // select로 countries(database) 받아옴
  const countries = yield select(selectors.getCountries);

  const key = Object.keys(action.payload)[0];
  const sortDirection = action.payload[key];

  // 정렬 후 정렬 방향 바꿔줌
  if (sortDirection === 'asc') {
    countries.sort((c1, c2) =>
      c1[key] < c2[key] ? -1 : c1[key] > c2[key] ? 1 : 0
    );
    yield put(
      setSortStatusSuccess({
        sort: {
          [key]: 'desc',
        },
        countries,
      })
    );
  } else {
    countries.sort((c1, c2) =>
      c1[key] < c2[key] ? 1 : c1[key] > c2[key] ? -1 : 0
    );
    yield put(
      setSortStatusSuccess({
        sort: {
          [key]: 'asc',
        },
        countries,
      })
    );
  }

  // 보여지는 countries(show) 초기화
  const showList = [];
  for (let i = 0; i < OFFSET; i++) showList.push(i);
  yield put(showActions.setCountries(showList));
}

// 새로운 국가 정보를 추가하는 saga
// 값 추가할 때 이전에 있는 값들과 비교해서 없으면 추가, 있으면 추가 안함
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

// 국가 정보 삭제하는 saga
function* removeSaga(action) {
  yield put(removeSuccess(action.payload));
  yield put(showActions.remove(action.payload));
}

// 검색이 다 끝나면(Search component), 보여지는 countries(show)를
// 원래대로 되돌리는 saga
function* rollbackSaga(action) {
  const prevNextId = yield select(selectors.getNextId);

  const list = [];

  for (let i = 0; i < prevNextId; i++) {
    list.push(i);
  }

  yield put(showActions.setCountries(list));
}

// offset만큼 보여지는 countries(show) 에 추가해주는 saga
function* loadCountriesSaga(action) {
  const isSearching = yield select(selectors.getIsSearching);

  if (!isSearching) {
    const totalLength = yield select(selectors.getTotalLength);
    const prevNextId = yield select(selectors.getNextId);

    const limit = Math.min(prevNextId + OFFSET, totalLength);
    const list = [];

    for (let i = prevNextId; i < limit; i++) {
      list.push(i);
    }

    yield put(loadCountriesSuccess(limit));
    yield put(showActions.appendCountries(list));
  }
}

// api를 통해 나라 정보들을 받아오고, 그걸로 초기화해주는 saga
function* setCountriesSaga(action) {
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

// 새로운 나라 정보를 추가하는 saga
function* addCountrySaga(action) {
  const { newCountry } = action.payload;

  const prevNextId = yield select(selectors.getNextId);
  newCountry.id = prevNextId;

  yield put(addCountrySuccess(newCountry));
  yield put(showActions.appendCountry(prevNextId));
}

export function* databaseSaga(action) {
  yield takeLatest(SET_COUNTRIES_REQUEST, setCountriesSaga);
  yield takeLatest(ADD_COUNTRY, addCountrySaga);
  yield takeLatest(LOAD_COUNTRIES_REQUEST, loadCountriesSaga);
  yield takeLatest(ROLLBACK, rollbackSaga);
  yield takeLatest(REMOVE_REQUEST, removeSaga);
  yield takeLatest(ADD_REQUEST, addSaga);
  yield takeLatest(SET_SORT_STATUS_REQUEST, setSortStatusSaga);
}

// reducer
const databaseReducer = handleActions(
  {
    [SET_SORT_STATUS_SUCCESS]: (prevState, action) => {
      const { countries, sort } = action.payload;
      const key = Object.keys(sort)[0];
      const sortDirection = sort[key];

      return {
        ...prevState,
        countries,
        sort: {
          ...prevState.sort,
          [key]: sortDirection,
        },
        nextId: OFFSET + 1,
        totalLength: countries.length,
      };
    },
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
      nextId: OFFSET + 1,
      countries: action.payload,
      totalLength: action.payload.length,
    }),

    [ADD_COUNTRY_SUCCESS]: (prevState, action) => ({
      ...prevState,
      countries: [...prevState.countries, action.payload],
      totalLength: prevState.totalLength + 1,
    }),
  },
  initialState
);

export default databaseReducer;
