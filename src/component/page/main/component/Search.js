import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import _ from 'lodash';

import { searchActions } from '../../../../module/search';
import { showActions } from '../../../../module/show';
import { databaseActions } from '../../../../module/database';

const Search = () => {
  const dispatch = useDispatch();

  const [target, setTarget] = useState('');
  const database = useSelector(({ database }) => database.countries);
  const { totalLength } = useSelector(({ database }) => database);
  const { keyword } = useSelector(({ search }) => search);

  //   const updateDebounce = _.debounce(() => {
  //     console.log('called');
  //     dispatch(searchActions.setKeyword(innerText));
  //   }, 5000);

  const searchData = keyword => {
    const searchResult = new Set();
    console.log('검색합니다: ', keyword);

    const regexOnlyNumber = /^[0-9]*$/g;
    const regexOnlyString = /^[a-z]*$/g;

    if (regexOnlyNumber.test(keyword)) {
      for (let i = 0; i < totalLength; i++) {
        const { callingCodes, id } = database[i];
        callingCodes.forEach(callingCode => {
          if (callingCode.includes(keyword)) {
            searchResult.add(id);
          }
        });
      }
    }

    if (regexOnlyString.test(keyword)) {
      for (let i = 0; i < totalLength; i++) {
        const { name, alpha2Code, capital, region, id } = database[i];
        if (
          name.toLowerCase().includes(keyword) ||
          alpha2Code.toLowerCase().includes(keyword) ||
          capital.toLowerCase().includes(keyword) ||
          region.toLowerCase().includes(keyword)
        ) {
          searchResult.add(id);
        }
      }
    }

    // show -> countries 에 data에서해당하는 값만을 담아주기
    // 대소문자 무시
    // 통합 검색
    // 모두 숫자면 -> callingCodes
    // 문자와 숫자가 섞여있다면 -> X
    // 모두 문자면 -> callingCodes 제외하고
    console.log(searchResult);
    dispatch(showActions.setCountries([...searchResult]));
  };

  const rollBack = () => {
    console.log('되돌립니다');
    dispatch(databaseActions.rollback());
  };

  useEffect(() => {
    if (keyword.length > 0) {
      console.log('SEARCH,', keyword);
      searchData(keyword);
    } else {
      console.log('SEARCH, 검색할 키워드 없음');
      rollBack();
    }
  }, [keyword]);

  const handleTarget = e => {
    const innerText = e.target.value;
    dispatch(searchActions.setKeyword(innerText));
    setTarget(innerText);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // dispatch(searchActions.setIsActive(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleTarget} value={target} type="text" />
    </form>
  );
};

export default Search;
