import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from '../../../../module/database';

const Information = ({ country }) => {
  const dispatch = useDispatch();

  const { name, alpha2Code, capital, region, callingCodes, id } = country;
  const handleRemove = () => {
    console.log(`${id}, ${name} 삭제`);
    dispatch(databaseActions.remove(id));
  };
  return (
    <ul>
      <li>{name}</li>
      <li>{alpha2Code}</li>
      <li>{capital}</li>
      <li>{region}</li>
      <li>{callingCodes}</li>
      <li>
        <button onClick={handleRemove}>삭제</button>
      </li>
    </ul>
  );
};

export default Information;
