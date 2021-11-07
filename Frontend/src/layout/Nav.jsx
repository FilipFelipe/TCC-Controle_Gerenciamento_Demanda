import React from 'react';
import NavItem from './NavItem';
import styles from './Nav.module.css';
import {
  faTools,
  faMicrochip,
  faTachometerAlt,
  faUsers,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { useSelector } from 'react-redux';

const AdminLinks = ({ children }) => {
  const admin = useSelector((state) => state.user.user.administrador);

  if (admin) {
    return <>{children}</>;
  }

  return <></>;
};
const Nav = () => {
  const menuState = useSelector((state) => state.ui.toggleMenu);
  return (
    <aside>
      <Logo className={menuState ? styles.smallLogo : styles.logo} />
      {!menuState ? (
        <p className={styles.logoName}>EnergyControl - IoT </p> 
      ) : (
        <p className={styles.smallLogoName}>EC - IoT</p>
      )}
      <nav className={styles.navMenu}>
        <NavItem location="/" icon={faTachometerAlt}>
          Dashboard
        </NavItem>
        <NavItem location="/equipamentos" icon={faMicrochip}>
          Equipamentos
        </NavItem>
        <NavItem location="/local" icon={faMapMarkerAlt}>
          Locais
        </NavItem>
        <AdminLinks>
          <NavItem location="/usuarios" icon={faUsers}>
            Usuários
          </NavItem>
          <NavItem location="/configuracao" icon={faTools}>
            Configuração
          </NavItem>
        </AdminLinks>
       
      </nav>
    </aside>
  );
};

export default Nav;
