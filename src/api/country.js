import axios from 'axios';

const URL =
  'https://restcountries.eu/rest/v2/all?fields=alpha2Code;capital;name;region;callingCodes';

export const get = async () =>
  await axios({
    url: URL,
    method: 'GET',
  });
