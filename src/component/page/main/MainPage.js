import React, { useEffect } from 'react';

import AddNew from './component/AddNew';
import Sort from './component/Sort';
import Informations from './component/Informations';
import Search from './component/Search';

const MainPage = () => {
  return (
    <div>
      <Search />
      <AddNew />
      <Sort />
      <Informations />
    </div>
  );
};

export default MainPage;
