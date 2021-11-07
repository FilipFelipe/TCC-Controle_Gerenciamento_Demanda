import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import style from './NavItem.module.css';

const NavItem = ({ icon, children, location }) => {
  const menuState = useSelector((state) => state.ui.toggleMenu);

  return (
    <NavLink className={style.navItem} to={location} end>
      <FontAwesomeIcon icon={icon} />
      <span className={menuState ? style.textHide : ''}>{children}</span>
    </NavLink>
  );
};

export default NavItem;
