import React, { useEffect } from 'react';

import Informations from './component/Informations';
import Search from './component/Search';

const MainPage = () => {
  return (
    <div>
      <Search />
      <Informations />
    </div>
  );
};

export default MainPage;
