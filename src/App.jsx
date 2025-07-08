import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FilmList from './components/FilmList';
import FilmDetailPage from './components/FilmDetailModal'; // yeni sayfa!
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
    <Router>
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
        onLogout={handleLogout} 
        isLoggedIn={isLoggedIn}
      />

      <Routes>
        <Route 
          path="/" 
          element={<FilmList isLoggedIn={isLoggedIn} onLoginRequired={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/films/:id" 
          element={<FilmDetailPage isLoggedIn={isLoggedIn} />} 
        />
      </Routes>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} />
    </Router>
  );
}

export default App;
