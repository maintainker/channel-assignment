import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { databaseActions } from '../../../../module/database';

const Item = ({ text, sortStatus, name }) => {
  const dispatch = useDispatch();

  /* event 함수 */
  const handleSort = () => {
    dispatch(
      databaseActions.setSortStatus({
        [name]: sortStatus,
      })
    );
  };

  return (
    <button onClick={handleSort}>
      {text} {sortStatus === 'asc' ? '내림차순으로' : '오름차순으로'}
    </button>
  );
};

const Sort = () => {
  const { sort } = useSelector(({ database }) => database);
  const { name, alpha2Code, capital, region, callingCodes } = sort;

  return (
    <div>
      <Item text="name" name="name" sortStatus={name} />
      <Item text="alpha 2 code" name="alpha2Code" sortStatus={alpha2Code} />
      <Item text="capital" name="capital" sortStatus={capital} />
      <Item text="region" name="region" sortStatus={region} />
      <Item
        text="calling codes"
        name="callingCodes"
        sortStatus={callingCodes}
      />
    </div>
  );
};

export default Sort;
