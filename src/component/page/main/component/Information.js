import React, { useEffect } from 'react';

const Information = ({ country }) => {
  const { name, alpha2Code, capital, region, callingCodes } = country;
  return (
    <ul>
      <li>{name}</li>
      <li>{alpha2Code}</li>
      <li>{capital}</li>
      <li>{region}</li>
      <li>{callingCodes}</li>
    </ul>
  );
};

export default Information;
