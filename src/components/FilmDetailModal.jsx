import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FilmDetailModal.css';
function FilmDetailModal({ isLoggedIn }) {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    setError(null);
    axios.get(`http://localhost:9090/api/films/${id}`)
      .then(res => setFilm(res.data))
      .catch(() => setError('Film bulunamadı veya yüklenemedi.'));

    axios.get(`http://localhost:9090/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !film?.imdbId) return;
      try {
        const res = await axios.get(`http://localhost:9090/api/favorites/${userId}`);
        const favorites = res.data;
        const isFav = favorites.some(f => f.filmImdbId === film.imdbId);
        setIsFavorite(isFav);
      } catch (err) {
        console.error('Favori kontrol hatası:', err);
      }
    };
    checkFavorite();
  }, [film, userId]);

  const handleFavorite = async () => {
    if (!film?.imdbId || !userId) {
      setFavError('Film veya kullanıcı bilgisi eksik.');
      return;
    }
    setFavLoading(true);
    setFavError(null);
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:9090/api/favorites`, {
          params: { userId, filmImdbId: film.imdbId }
        });
        setIsFavorite(false);
      } else {
        await axios.post(`http://localhost:9090/api/favorites`, {
          userId, filmImdbId: film.imdbId
        });
        setIsFavorite(true);
      }
    } catch (err) {
      setFavError('Favori işlemi başarısız.');
    } finally {
      setFavLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content || rating === 0) return;
    try {
      const newReview = {
        filmId: id,
        userEmail: localStorage.getItem('email'),
        content,
        rating,
        date: new Date().toISOString()
      };
      const res = await axios.post('http://localhost:9090/api/reviews', newReview);
      setReviews([...reviews, res.data]);
      setContent('');
      setRating(0);
    } catch (err) {}
  };

  if (error) return <p className="text-center mt-5 text-danger fs-4">{error}</p>;
  if (!film) return <p className="text-center mt-5 text-secondary">Yükleniyor...</p>;

  return (
<section className="film-detail-section py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-5 align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={film.poster}
              alt={film.title}
              className="rounded-4 shadow-lg mb-4 film-detail-img"
              style={{ maxWidth: '260px', width: '100%', objectFit: 'cover', maxHeight: '370px' }}
            />
            <button
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} w-100 fw-bold mb-2 film-fav-btn`}
              onClick={handleFavorite}
              disabled={favLoading}
              style={{ minWidth: '160px' }}
            >
              {favLoading ? 'İşleniyor...' : isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </button>
            {favError && <span className="text-danger ms-2">{favError}</span>}
          </div>
          <div className="col-md-8">
            <h1 className="display-4 fw-bold mb-3 text-gradient">{film.title}</h1>
           
            <div className="fst-italic text-uppercase text-secondary mb-3 ps-3 border-start border-danger border-3" style={{ letterSpacing: '1px' }}>
              {film.slogan || ''}
            </div>
            <div className="rounded-4 shadow overflow-hidden mb-4" style={{ maxWidth: '100%', maxHeight: '360px' }}>
              {film.trailerLink ? (
                <iframe
                  src={film.trailerLink.replace('watch?v=', 'embed/')}
                  title="Fragman"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
                />
              ) : (
                <p className="text-muted">Fragman bulunamadı.</p>
              )}
            </div>
          </div>
        </div>
        <div className="review-card">
          <h2 className="fs-3 fw-bold mb-4 text-gradient">Yorumlar</h2>
          {reviews.length === 0 ? (
            <div className="alert alert-info">Henüz yorum yapılmamış. İlk yorumu sen yap!</div>
          ) : (
            <ul className="list-unstyled">
              {reviews.map((r, idx) => (
                <li key={idx} className="card p-3 mb-3 shadow-sm rounded-4 review-card">
                  <div className="d-flex justify-content-between mb-2">
                    <span className='review-card'>{r.userEmail}</span>
                  </div>
                  <p className="mb-1 review-card">{r.content}</p>
                  <div className="text-warning">★ {r.rating} / 5</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {isLoggedIn ? (
          <div className="mt-5">
            <h2 className="fs-4 fw-bold mb-3 text-gradient">Yorum Yap</h2>
            <div className="card p-4 shadow-sm border border-primary rounded-4">
              <textarea
                className="form-control mb-3"
                value={content}
                placeholder="Yorumunuzu yazın..."
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
              <input
                type="number"
                min="1"
                max="5"
                className="form-control mb-3"
                placeholder="Puan (1-5)"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              />
              <button onClick={handleSubmit} className="btn btn-success w-100 fw-bold">
                Yorumu Gönder
              </button>
            </div>
          </div>
        ) : (
          <p className="text-danger mt-4 review-card">Yorum yapmak için giriş yapmalısınız.</p>
        )}
      </div>
    </section>
  );
}

export default FilmDetailModal;
