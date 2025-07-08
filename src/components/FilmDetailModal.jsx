import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FilmDetailModal({ isLoggedIn }) {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    axios.get(`http://localhost:9090/api/films/${id}`)
      .then(res => setFilm(res.data))
      .catch(() => setError('Film bulunamadı veya yüklenemedi.'));

    axios.get(`http://localhost:9090/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(console.error);
  }, [id]);

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
    } catch (err) {
      console.error('Yorum gönderilemedi', err);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (error) return <p className="text-center mt-5 text-danger fs-4">{error}</p>;
  if (!film) return <p className="text-center mt-5 text-secondary">Yükleniyor...</p>;

  const description = film.description || "Ethan Hunt and team continue their search for the terrifying AI known as the Entity...";
  const director = film.director || 'Christopher McQuarrie';
  const year = film.releaseDate ? film.releaseDate.split('-')[0] : '';
  const slogan = film.slogan || 'OUR LIVES ARE THE SUM OF OUR CHOICES.';

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '1100px' }}>
      <div className="row g-4">
        {/* Sol Sütun: Küçük Poster */}
        <div className="col-md-3 d-flex justify-content-center">
          <img
            src={film.poster}
            alt={film.title}
            className="rounded shadow"
            style={{
              maxWidth: '180px',
              width: '100%',
              objectFit: 'cover',
              maxHeight: '270px',  // posterin yüksekliği sınırlandı
              marginBottom: '20px' // alt boşluk eklendi
            }}
          />
        </div>

        {/* Sağ Sütun: Yazılar + Trailer */}
        <div className="col-md-9">
          {/* Yazılar */}
          <h1 className="fw-bold mb-2" style={{
            background: 'linear-gradient(to right, #e50914, #b81d24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.2rem'
          }}>{film.title}</h1>

          <div className="text-muted mb-2 fs-5">
            <span>{year}</span> • Directed by <strong className="text-primary">{director}</strong>
          </div>

          <div className="fst-italic text-uppercase text-secondary mb-3 ps-3 border-start border-danger border-3" style={{ letterSpacing: '1px' }}>
            {slogan}
          </div>

          <div className="bg-light p-3 rounded border mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
            {description}
          </div>

          <div className="d-flex gap-4 mb-3">
            <span className="text-success"><i className="bi bi-eye-fill"></i> 565K</span>
            <span className="text-primary"><i className="bi bi-hand-thumbs-up-fill"></i> 146K</span>
            <span className="text-danger"><i className="bi bi-heart-fill"></i> 173K</span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fw-semibold">Puan Ortalaması:</span>
            <span className="badge bg-warning text-dark fs-5">{averageRating}</span>
            <span className="text-muted">{reviews.length} oy</span>
          </div>

          {/* Trailer */}
          <div className="rounded shadow overflow-hidden" style={{ maxWidth: '100%', maxHeight: '360px' }}>
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

      {/* Yorumlar Bölümü */}
      <div className="mt-5">
        <h2 className="fs-4 fw-bold mb-3">Yorumlar</h2>
        {reviews.length === 0 ? (
          <div className="alert alert-info">Henüz yorum yapılmamış. İlk yorumu sen yap!</div>
        ) : (
          <ul className="list-unstyled">
            {reviews.map((r, idx) => (
              <li key={idx} className="card p-3 mb-3 shadow-sm">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold text-primary">{r.userEmail}</span>
                  <span className="text-muted small">{new Date(r.date).toLocaleString('tr-TR')}</span>
                </div>
                <p className="mb-1">{r.content}</p>
                <div className="text-warning">⭐ {r.rating} / 5</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Yorum Yapma Bölümü */}
      {isLoggedIn ? (
        <div className="mt-5">
          <h2 className="fs-4 fw-bold mb-3">Yorum Yap</h2>
          <div className="card p-4 shadow-sm border border-primary">
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
            <button onClick={handleSubmit} className="btn btn-success w-100">
              Yorumu Gönder
            </button>
          </div>
        </div>
      ) : (
        <p className="text-danger mt-4">Yorum yapmak için giriş yapmalısınız.</p>
      )}
    </div>
  );
}

export default FilmDetailModal;
