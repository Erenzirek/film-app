import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLoginClick, onRegisterClick, onLogout, isLoggedIn }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand" href="#">🎬 FilmZone</a>

      <div className="ms-auto">
        {!isLoggedIn ? (
          <>
            <button className="btn btn-outline-light me-2" onClick={onLoginClick}>Giriş Yap</button>
            <button className="btn btn-outline-light" onClick={onRegisterClick}>Kayıt Ol</button>
          </>
        ) : (
          <>
            <Link to="/favorites" className="btn btn-warning me-2">Favori Filmlerim</Link>
            <button className="btn btn-danger" onClick={onLogout}>Çıkış</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;