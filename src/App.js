import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from './module/database';
import MainPage from './component/page/main/MainPage';

import './styles/reset.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(databaseActions.setCountries());
  }, []);

  return <MainPage />;
};

export default App;
