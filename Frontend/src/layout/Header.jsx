import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { toggleMenu } from '../store/ui';
import { logoff } from '../store/user';
import style from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const menuState = useSelector((state) => state.ui.toggleMenu);
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigate();

  function menuToggle() {
    dispatch(toggleMenu());
  }

  function handleLogoff() {
    dispatch(logoff());
    window.localStorage.removeItem('user');
    navigation('/login');
  }

  return (
    <header>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {user && (
        <>
          <button
            onClick={menuToggle}
            className={`${menuState && style.menuMinimized} ${
              style.menuButton
            }`}
          >
            <FontAwesomeIcon icon={faBars} />
            <p className={style.headerText}>Dashboard</p>{' '}
          </button>
          <button onClick={handleLogoff} className={style.btnSair}>
            <span>Sair</span>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
