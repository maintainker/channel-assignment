import * as React from 'react';
import * as ReactDOM from 'react-dom';
const { hot } = require('react-hot-loader/root');
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './module/index';

import App from './App.js';

const Hot = hot(App);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <Hot />
  </Provider>,
  document.getElementById('root')
);
