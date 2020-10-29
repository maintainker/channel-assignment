import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import Information from './Information';
import { databaseActions } from '../../../../module/database';

const Informations = () => {
  const dispatch = useDispatch();

  const database = useSelector(({ database }) => database.countries);
  const { countries } = useSelector(({ show }) => show);
  const { keyword } = useSelector(({ search }) => search);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (database.length > 0) {
      loadData();
    }
  }, []);

  // database 에서 offset만큼 countries에 넣어줌
  const loadData = () => {
    dispatch(databaseActions.loadCountries());
  };

  const load = _.throttle(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadData();
    }
  }, 300);

  const handleScroll = () => load();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll');
    };
  }, []);

  return (
    <div>
      {countries.length > 0 && (
        <div>
          {countries.map(
            idx =>
              database[idx] && <Information country={database[idx]} key={idx} />
          )}
        </div>
      )}
    </div>
  );
};

export default Informations;
