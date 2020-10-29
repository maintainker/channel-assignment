import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from './module/database';
import MainPage from './component/page/main/MainPage';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('기본 데이터를 불러옵니다...');
    dispatch(databaseActions.setCountries());
  }, []);
  return <MainPage />;
};

export default App;
