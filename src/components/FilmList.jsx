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
    <div className="container mt-4">
      <div className="row">
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
  );
}

export default FilmList;
