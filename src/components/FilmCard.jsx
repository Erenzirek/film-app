import React from 'react';
import { useNavigate } from 'react-router-dom';

function FilmCard({ film, isLoggedIn, onLoginRequired }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    navigate(`/films/${film.imdbId}`);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div
        className="card film-card h-100 border-0 shadow-lg position-relative overflow-hidden animate__animated animate__fadeInUp"
        onClick={handleClick}
        style={{ cursor: 'pointer', borderRadius: '1.5rem', minHeight: '420px', background: 'linear-gradient(135deg, #23272f 0%, #6366f1 100%)' }}
      >
        <div className="film-card-img-wrapper position-relative">
          <img
            src={film.poster}
            className="card-img-top film-card-img"
            alt={film.title}
            style={{ height: '320px', objectFit: 'cover', borderRadius: '1.2rem 1.2rem 0 0', boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)' }}
          />
          <span className="badge bg-accent position-absolute top-0 end-0 m-2 px-3 py-2 fs-6 shadow">{film.releaseDate?.split('-')[0]}</span>
        </div>
        <div className="card-body d-flex flex-column justify-content-end p-4 bg-dark text-light">
          <h5 className="card-title text-white fw-bold mb-2" style={{ fontSize: '1.15rem', letterSpacing: '0.5px' }}>{film.title}</h5>
        </div>
      </div>
    </div>
  );
}

export default FilmCard;
