import { handleActions, createAction } from 'redux-actions';
import { takeLatest, delay, put } from 'redux-saga/effects';

const initialState = {
  keyword: '',
  isSearching: false,
};

// action type
//.. keyword
const SET_KEYWORD = 'search/SET_KEYWORD';
const SET_KEYWORD_SUCCESS = 'search/SET_KEYWORD_SUCCESS';

//.. searching status
const SET_IS_SEARCHING = 'search/SET_IS_SEARCHING';

// action creator
export const searchActions = {
  setKeyword: createAction(SET_KEYWORD),
};
const setKeywordSuccess = createAction(SET_KEYWORD_SUCCESS);
const setIsSearching = createAction(SET_IS_SEARCHING);

// saga
function* searchKeywordSaga(action) {
  yield delay(300);
  yield put(setKeywordSuccess(action.payload));
  if (action.payload.length > 0) yield put(setIsSearching(true));
  else yield put(setIsSearching(false));
}

export function* searchSaga() {
  yield takeLatest(SET_KEYWORD, searchKeywordSaga);
}

// reducer
const searchReducer = handleActions(
  {
    [SET_IS_SEARCHING]: (prevState, action) => ({
      ...prevState,
      isSearching: action.payload,
    }),
    [SET_KEYWORD_SUCCESS]: (prevState, action) => ({
      ...prevState,
      keyword: action.payload.toLowerCase(),
    }),
  },
  initialState
);
export default searchReducer;
