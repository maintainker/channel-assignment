import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from '../../../../module/database';

import '../../../../styles/information.scss';

const Information = memo(({ country }) => {
  const dispatch = useDispatch();

  const { name, alpha2Code, capital, region, callingCodes, id } = country;

  /* event 함수 */
  const handleRemove = () => {
    dispatch(databaseActions.remove(id));
  };

  return (
    <ul className="information">
      <li className="information__item">{name}</li>
      <li className="information__item">{alpha2Code}</li>
      <li className="information__item">{capital}</li>
      <li className="information__item">{region}</li>
      <li className="information__item">{callingCodes}</li>
      <li onClick={handleRemove} className="information__item button">
        🗑
      </li>
    </ul>
  );
});

export default Information;
