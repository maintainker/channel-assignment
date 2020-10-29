import { handleActions, createAction } from 'redux-actions';
import { takeLatest, delay, put } from 'redux-saga/effects';

const initialState = {
  keyword: '',
};

// action type

const SET_KEYWORD = 'SET_KEYWORD';
const SET_KEYWORD_SUCCESS = 'SET_KEYWORD_SUCCESS';

// action creator
export const searchActions = {
  setKeyword: createAction(SET_KEYWORD),
};
const setKeywordSuccess = createAction(SET_KEYWORD_SUCCESS);

// saga
function* searchKeywordSaga(action) {
  yield delay(300);
  yield put(setKeywordSuccess(action.payload));
}

export function* searchSaga() {
  yield takeLatest(SET_KEYWORD, searchKeywordSaga);
}

// reducer
const searchReducer = handleActions(
  {
    [SET_KEYWORD_SUCCESS]: (prevState, action) => ({
      ...prevState,
      keyword: action.payload.toLowerCase(),
    }),
  },
  initialState
);
export default searchReducer;
