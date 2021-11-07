import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import Dashboard from '../components/content/Dashboard/Dashboard';
import Equipamentos from '../components/content/Equipamentos/Equipamentos';
import Configuracao from '../components/content/Configuracao/Configuracao';
import style from './Main.module.css';
import MainHeader from './MainHeader';
import Usuarios from '../components/content/Usuarios/Usuarios';
import Local from '../components/content/Local/Local';
import { useSelector } from 'react-redux';

const Main = () => {
  const admin = useSelector((state) => state.user.user.administrador);

  return (
    <main>
      <MainHeader />
      <section className={style.contentArea}>
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/equipamentos" exact element={<Equipamentos />} />
          <Route path="/local" exact element={<Local />} />
          {!!admin && (
            <>
              <Route path="/configuracao" exact element={<Configuracao />} />
              <Route path="/usuarios" exact element={<Usuarios />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>
    </main>
  );
};

export default Main;
