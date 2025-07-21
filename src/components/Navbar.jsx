import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLoginClick, onRegisterClick, onLogout, isLoggedIn }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark shadow-lg py-3 custom-navbar"
>

      <div className="container-fluid">
      <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/">
          <span style={{fontSize: '2.rem'}}>🎬</span> FilmReviewZone
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse justify-content-end${expanded ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav align-items-center gap-lg-2 gap-1">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-outline-primary nav-btn me-2" onClick={onLoginClick}>Giriş Yap</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-primary nav-btn" onClick={onRegisterClick}>Kayıt Ol</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/" className="btn btn-outline-light nav-btn me-2">Ana Sayfa</Link>
                </li>
                <li className="nav-item">
                  <Link to="/favorites" className="btn btn-success nav-btn me-2 text-white">Favori Filmlerim</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger nav-btn" onClick={onLogout}>Çıkış</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;