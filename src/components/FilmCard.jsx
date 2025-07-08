import React from 'react';

function FilmCard({ film, isLoggedIn, onLoginRequired }) {
  const handleClick = () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    alert(`Fragman ve yorumlar açılıyor: ${film.title}`);
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
