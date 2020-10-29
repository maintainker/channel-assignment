import React, { useEffect } from 'react';

import AddNew from './component/AddNew';
import Informations from './component/Informations';
import Search from './component/Search';

const MainPage = () => {
  return (
    <div>
      <Search />
      <AddNew />
      <Informations />
    </div>
  );
};

export default MainPage;
