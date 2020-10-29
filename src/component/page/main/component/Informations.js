import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import Information from './Information';
import { databaseActions } from '../../../../module/database';

const Informations = () => {
  const OFFSET = 20;

  const dispatch = useDispatch();

  const database = useSelector(({ database }) => database.countries);
  const { countries } = useSelector(({ show }) => show);

  useEffect(() => {
    if (database.length > 0) {
      loadData();
    }
  }, [database]);

  // database 에서 offset만큼 countries에 넣어줌
  const loadData = () => {
    console.log('INFORMATION load data called');
    dispatch(databaseActions.loadCountries());
  };
  const load = _.throttle(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadData();
    }
  }, 300);

  const handleScroll = () => {
    load();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll');
    };
  }, []);

  return (
    <div>
      {countries.length > 0 &&
        countries.map(country => (
          <Information country={country} key={country.name} />
        ))}
    </div>
  );
};

export default Informations;