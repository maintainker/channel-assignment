import { createAction, handleActions } from 'redux-actions';

// initial state
const initialState = {
  countries: [],
};

// action type
const SET_COUNTRIES = 'show/SET_COUNTRIES';
const APPEND_COUNTRIES = 'show/APPEND_COUNTRIES';
const REMOVE = 'show/REMOVE';

// action creator
export const showActions = {
  appendCountries: createAction(APPEND_COUNTRIES),
  setCountries: createAction(SET_COUNTRIES),
  remove: createAction(REMOVE),
};

// reducer
const showReducer = handleActions(
  {
    [REMOVE]: (prevState, action) => ({
      ...prevState,
      countries: prevState.countries.filter(id => action.payload !== id),
    }),
    [APPEND_COUNTRIES]: (prevState, action) => ({
      ...prevState,
      countries: [...prevState.countries, ...action.payload],
    }),
    [SET_COUNTRIES]: (prevState, action) => ({
      ...prevState,
      countries: action.payload,
    }),
  },
  initialState
);

export default showReducer;
