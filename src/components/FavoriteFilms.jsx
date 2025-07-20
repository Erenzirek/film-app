import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FavoriteFilms() {
  const [favoriteFilmIds, setFavoriteFilmIds] = useState([]);
  const [favoriteFilms, setFavoriteFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('Favori filmleri görmek için giriş yapmalısınız.');
      setLoading(false);
      return;
    }
    fetch(`http://localhost:9090/api/favorites/${userId}`)
      .then(res => res.json())
      .then(data => {
        // filmImdbId listesini al
        setFavoriteFilmIds(data.map(f => f.filmImdbId));
      })
      .catch(() => {
        setError('Favori filmler yüklenemedi.');
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (favoriteFilmIds.length === 0) {
      setFavoriteFilms([]);
      setLoading(false);
      return;
    }

    // Favori film detaylarını Promise.all ile çek
    Promise.all(
      favoriteFilmIds.map(imdbId =>
        fetch(`http://localhost:9090/api/films/${imdbId}`).then(res => res.json())
      )
    )
      .then(films => {
        setFavoriteFilms(films);
        setLoading(false);
      })
      .catch(() => {
        setError('Film detayları yüklenemedi.');
        setLoading(false);
      });
  }, [favoriteFilmIds]);

  if (loading) return <div className="container mt-5">Yükleniyor...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Favori Filmlerim</h2>
      {favoriteFilms.length === 0 ? (
        <div className="alert alert-info">Henüz favori filminiz yok.</div>
      ) : (
        <div className="row g-4">
          {favoriteFilms.map(film => (
            <div className="col-md-3" key={film.imdbId}>
              <div className="card h-100 shadow-sm">
                <img src={film.poster} alt={film.title} className="card-img-top" style={{ height: '320px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{film.title}</h5>
                  <p className="card-text text-muted mb-2">{film.releaseDate?.split('-')[0]}</p>
                  <Link to={`/films/${film.imdbId}`} className="btn btn-primary mt-auto">Detaya Git</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteFilms;
