import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { databaseActions } from '../../../../module/database';

const AddNew = () => {
  const dispatch = useDispatch();

  const [countryData, setCountryData] = useState({
    name: '',
    alpha2Code: '',
    capital: '',
    region: '',
    callingCodes: [],
  });

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleCountryData}
        name="name"
        value={countryData.name}
        placeholder="name"
        required
      />
      <input
        type="text"
        onChange={handleCountryData}
        name="alpha2Code"
        value={countryData.alpha2Code}
        placeholder="alpha2Code"
        required
      />
      <input
        type="text"
        onChange={handleCountryData}
        name="capital"
        value={countryData.capital}
        placeholder="capital"
        required
      />
      <input
        type="text"
        onChange={handleCountryData}
        name="region"
        value={countryData.region}
        placeholder="region"
        required
      />
      <input
        type="text"
        onChange={handleCountryData}
        name="callingCodes"
        value={countryData.callingCodes}
        placeholder="callingCodes"
        required
      />
      <input type="submit" />
    </form>
  );
};

export default AddNew;
