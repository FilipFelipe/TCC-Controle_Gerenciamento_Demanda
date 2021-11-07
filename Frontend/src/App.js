import React from 'react';
import './App.css';
import Main from './layout/Main';
import Nav from './layout/Nav';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/login/Login';

function App() {
  const menuState = useSelector((state) => state.ui.toggleMenu);
  const user = useSelector((state) => state.user.user);

  return (
    <div className={`content ${menuState && 'minimizedMenu'}`}>
      <BrowserRouter>
        {user ? (
          <>
            <Header />
            <Nav />
            <Main />
            <Footer />
          </>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
