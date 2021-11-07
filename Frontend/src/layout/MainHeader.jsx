import React from 'react';
import { useSelector } from 'react-redux';
import style from './MainHeader.module.css';

const MainHeader = () => {
  const title = useSelector((state) => state.ui.mainHeaderTitle);

  return (
    <div>
      <section className={style.mainHeader}>
        <span className={style.mainHeaderTitle}>{title}</span>
      </section>
    </div>
  );
};

export default MainHeader;
