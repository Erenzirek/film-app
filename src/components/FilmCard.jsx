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
    <div className="col-md-3 mb-4">
      <div className="card h-100" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={film.poster} className="card-img-top" alt={film.title} />
        <div className="card-body">
          <h5 className="card-title">{film.title}</h5>
          <p className="card-text">{film.releaseDate}</p>
        </div>
      </div>
    </div>
  );
}

export default FilmCard;
