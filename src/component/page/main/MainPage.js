import React, { useEffect } from 'react';

import AddNew from './component/AddNew';
import Sort from './component/Sort';
import Informations from './component/Informations';
import Search from './component/Search';

import '../../../styles/main-page.scss';
import '../../../styles/search.scss';

const MainPage = () => {
  return (
    <div className="container">
      <div className="container__area" />
      <div className="container__menu">
        <Search />
        <AddNew />
        <Sort />
      </div>

      <div className="container__informations">
        <Informations />
      </div>
    </div>
  );
};

export default MainPage;
