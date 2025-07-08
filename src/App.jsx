import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FilmList from './components/FilmList';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
        onLogout={handleLogout} 
        isLoggedIn={isLoggedIn}
      />

      <FilmList isLoggedIn={isLoggedIn} onLoginRequired={() => setShowLogin(true)} />

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} />
    </div>
  );
}

export default App;
