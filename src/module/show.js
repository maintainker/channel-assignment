import { createAction, handleActions } from 'redux-actions';

const initialState = {
  countries: [],
};

// action type
const SET_COUNTRIES = 'show/SET_COUNTRIES';
const APPEND_COUNTRIES = 'show/APPEND_COUNTRIES';

// action creator
export const showActions = {
  appendCountries: createAction(APPEND_COUNTRIES),
  setCountries: createAction(SET_COUNTRIES),
};

// saga

// reducer
const showReducer = handleActions(
  {
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
// const showReducer = handleActions(
// {},
// {
//   [APPEND_COUNTRIES]: (prevState, action) => ({
//     ...prevState,
//     countries: [...prevState.countries, action.payload],
//   }),

//   [SET_COUNTRIES]: (prevState, action) => ({
//     ...prevState,
//     countries: action.payload,
//   }),
// },
//   initialState
// );

export default showReducer;
