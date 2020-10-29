import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import _ from 'lodash';

import { regex } from '../../../../lib/utils';
import { searchActions } from '../../../../module/search';
import { showActions } from '../../../../module/show';
import { databaseActions } from '../../../../module/database';

const Search = () => {
  const dispatch = useDispatch();

  const { keyword } = useSelector(({ search }) => search);
  const database = useSelector(({ database }) => database.countries);
  const { totalLength } = useSelector(({ database }) => database);
  const [target, setTarget] = useState('');

  /* 일반 함수 */
  // keyword로 검색하는 함수
  // 모두 문자인 경우는 calling codes를 제외하고 검색을,
  // 모두 숫자인 경우는 calling codes만 검색함
  // 그리고 둘이 섞인 경우에는 검색 안함
  const searchData = keyword => {
    const searchResult = new Set();

    const regexOnlyNumber = new RegExp(regex.regexOnlyNumber, 'g');
    const regexOnlyString = new RegExp(regex.regexOnlyString, 'g');

    // 모두 숫자인 경우 (calling codes 만)
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

    // 모두 문자인 경우 (calling codes 외)
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

    dispatch(showActions.setCountries([...searchResult]));
  };

  // 화면에 보여주는 데이터인 countries(show) 를
  // 다시 되돌려주는 함수
  // 왜냐하면, 검색이 다 끝났으니 이전 상태로 돌려줘야 하기 때문임
  const rollBack = () => {
    dispatch(databaseActions.rollback());
  };

  /* event 함수 */
  const handleTarget = e => {
    const innerText = e.target.value;
    dispatch(searchActions.setKeyword(innerText));
    setTarget(innerText);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  /* life cycle */
  useEffect(() => {
    if (keyword.length > 0) {
      searchData(keyword);
    } else {
      rollBack();
    }
  }, [keyword]);

  return (
    <form className="search__form" onSubmit={handleSubmit}>
      <input
        className="search__input"
        onChange={handleTarget}
        value={target}
        type="text"
      />
    </form>
  );
};

export default Search;
