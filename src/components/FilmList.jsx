import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilmCard from './FilmCard';

function FilmList({ isLoggedIn, onLoginRequired }) {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9090/api/films')
      .then(res => setFilms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="film-list-section py-5">
      <div className="container">
        <h2 className="display-5 fw-bold mb-5 text-center text-gradient">Popüler Filmler</h2>
        <div className="row g-4 justify-content-center">
          {films.map(film => (
            <FilmCard 
              key={film.imdbId} 
              film={film} 
              isLoggedIn={isLoggedIn} 
              onLoginRequired={onLoginRequired}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FilmList;