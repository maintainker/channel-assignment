import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from '../../../../module/database';
import { regex } from '../../../../lib/utils';

import '../../../../styles/add-new.scss';

const Item = ({ name, onChange, v, pattern }) => {
  return (
    <input
      className="add-new__input"
      type="text"
      required
      name={name}
      placeholder={name}
      onChange={onChange}
      pattern={pattern}
      value={v}
    />
  );
};

const AddNew = () => {
  const dispatch = useDispatch();

  const [countryData, setCountryData] = useState({
    name: '',
    alpha2Code: '',
    capital: '',
    region: '',
    callingCodes: [],
  });

  /* event */
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(databaseActions.add(countryData));
    setCountryData({
      name: '',
      alpha2Code: '',
      capital: '',
      region: '',
      callingCodes: [],
    });
  };

  const handleCountryData = e => {
    const { name, value } = e.target;
    setCountryData({
      ...countryData,
      [name]:
        name === 'callingCodes' ? value.split(',').map(v => v.trim()) : value,
    });
  };

  return (
    <form className="add-new" onSubmit={handleSubmit}>
      <Item
        name="name"
        onChange={handleCountryData}
        v={countryData.name}
        pattern={regex.regexOnlyString}
      />
      <Item
        name="alpha2Code"
        onChange={handleCountryData}
        v={countryData.alpha2Code}
        pattern={regex.regexOnly2Char}
      />
      <Item
        name="capital"
        onChange={handleCountryData}
        v={countryData.capital}
        pattern={regex.regexOnlyString}
      />
      <Item
        name="region"
        onChange={handleCountryData}
        v={countryData.region}
        pattern={regex.regexOnlyString}
      />
      <Item
        name="callingCodes"
        onChange={handleCountryData}
        v={countryData.callingCodes}
        pattern={regex.regexOnlyNumber}
      />
      <input type="submit" />
    </form>
  );
};

export default AddNew;
