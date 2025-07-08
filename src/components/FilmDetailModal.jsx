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
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setError(null);
    axios.get(`http://localhost:9090/api/films/${id}`)
      .then(res => setFilm(res.data))
      .catch(err => {
        console.error(err);
        setError('Film bulunamadı veya yüklenemedi.');
      });

    axios.get(`http://localhost:9090/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
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

  // Rastgele info jeneratörü (film başlığına göre)
  const randomFacts = [
    'Bu film eleştirmenlerden tam not aldı.',
    'Çekimleri 3 ay sürdü.',
    'Başrol oyuncusu bu film için 10 kilo aldı.',
    'Film, gerçek bir hikayeden uyarlandı.',
    'Müzikleriyle ödül kazandı.',
    'Dünya çapında büyük gişe başarısı elde etti.',
    'Yönetmen bu filmle ilk ödülünü aldı.',
    'Filmdeki bazı sahneler doğaçlamaydı.',
    'Çekimler sırasında ilginç kazalar yaşandı.',
    'Senaryosu 2 yılda tamamlandı.'
  ];
  function getRandomFact(title) {
    // Her film için sabit bir info gelsin diye title hashle
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
    return randomFacts[hash % randomFacts.length];
  }

  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (!film) return <p className="text-center mt-8">Yükleniyor...</p>;

  // film propertylerine erişim bundan sonra
  const description = film.description || "Ethan Hunt and team continue their search for the terrifying AI known as the Entity — which has infiltrated intelligence networks all over the globe — with the world's governments and a mysterious ghost from Hunt's past on their trail. Joined by new allies and armed with the means to shut the Entity down for good, Hunt is in a race against time to prevent the world as we know it from changing forever.";
  const director = film.director || 'Christopher McQuarrie';
  const year = film.releaseDate ? film.releaseDate.split('-')[0] : '';
  const slogan = film.slogan || 'OUR LIVES ARE THE SUM OF OUR CHOICES.';

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '1100px' }}>
      <div className="row g-4 align-items-start">
        {/* Poster */}
        <div className="col-md-4 d-flex flex-column align-items-center">
          <img src={film.poster} alt={film.title} className="rounded shadow mb-3" style={{ width: '100%', maxWidth: '320px', minWidth: '220px', objectFit: 'cover' }} />
          {film.trailerLink && (
            <div className="w-100 mt-3" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
              <iframe
                src={film.trailerLink.replace('watch?v=', 'embed/')}
                title="Fragman"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16/9', minHeight: '180px', border: 'none' }}
              />
            </div>
          )}
        </div>
        {/* Film Detayları */}
        <div className="col-md-8">
          <h1 className="display-5 fw-bold mb-1">{film.title}</h1>
          <div className="mb-2 text-secondary" style={{ fontSize: '1.1rem' }}>
            <span>{year}</span>
            {director && <span> &nbsp; Directed by <span className="fw-semibold text-primary">{director}</span></span>}
          </div>
          <div className="fst-italic text-uppercase text-muted mb-3" style={{ letterSpacing: '1px', fontSize: '1.05rem' }}>{slogan}</div>
          <div className="bg-dark bg-opacity-10 rounded p-3 mb-3" style={{ fontSize: '1.08rem', lineHeight: '1.6' }}>{description}</div>
          <div className="d-flex align-items-center gap-4 mb-3">
            <span className="text-success"><i className="bi bi-eye-fill"></i> 565K</span>
            <span className="text-primary"><i className="bi bi-hand-thumbs-up-fill"></i> 146K</span>
            <span className="text-danger"><i className="bi bi-heart-fill"></i> 173K</span>
          </div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="fw-semibold">RATINGS</span>
            <span className="badge bg-warning text-dark" style={{ fontSize: '1.1rem' }}>{averageRating}</span>
            <span className="text-muted" style={{ fontSize: '0.95rem' }}>{reviews.length} FANS</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Yorumlar</h2>
        {reviews.length === 0 ? (
          <p>Henüz yorum yok.</p>
        ) : (
          <ul className="list-group">
            {reviews.map((r, idx) => (
              <li key={idx} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold">{r.userEmail}</span>
                  <span className="text-muted" style={{ fontSize: '0.9em' }}>{r.date ? new Date(r.date).toLocaleString('tr-TR') : ''}</span>
                </div>
                <div className="mb-1">{r.content}</div>
                <div className="text-warning">Puan: {r.rating}/5</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoggedIn && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Yorum Yap</h2>
          <div className="card p-3 shadow-sm mb-3">
            <div className="mb-2">
              <textarea
                className="form-control mb-2"
                value={content}
                placeholder="Yorumunuzu yazın..."
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
              <input
                type="number"
                min="1"
                max="5"
                className="form-control mb-2"
                placeholder="Puan (1-5)"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              />
            </div>
            <button onClick={handleSubmit} className="btn btn-primary w-100">
              Yorumu Gönder
            </button>
          </div>
        </div>
      )}

      {!isLoggedIn && <p className="text-red-600 mt-4">Yorum yapmak için giriş yapmalısınız.</p>}
    </div>
  );
}

export default FilmDetailModal;
