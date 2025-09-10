// src/pages/FilmDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HallScheme from '../components/tickets/HallScheme';
import { getFilmById, getScreeningsByFilmId } from '../services/api';

export default function FilmDetailsPage() {
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHallScheme, setShowHallScheme] = useState(false);

  // Загружаем данные фильма и сеансов
  useEffect(() => {
    const loadFilmData = async () => {
      try {
        const filmData = await getFilmById(filmId);
        const screeningsData = await getScreeningsByFilmId(filmId);

        setFilm(filmData);
        setScreenings(screeningsData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Не удалось загрузить информацию о фильме');
      } finally {
        setLoading(false);
      }
    };

    loadFilmData();
  }, [filmId]);

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  if (!film) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Фильм не найден</p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Основная информация о фильме */}
      <div style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '40px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Постер */}
        <img
          src={film.poster_url}
          alt={film.title}
          style={{
            width: '300px',
            height: '450px',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        />

        {/* Информация */}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333' }}>
            {film.title}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', marginBottom: '16px' }}>
            <strong>Жанр:</strong>
            <span>{film.genre_name}</span>

            <strong>Длительность:</strong>
            <span>{film.duration_min} мин</span>

            <strong>Рейтинг:</strong>
            <span>⭐ {typeof film.avg_rating === 'number' ? film.avg_rating.toFixed(1) : film.rating || 'Нет'}</span>

            <strong>Дата выхода:</strong>
            <span>{film.release_date}</span>
          </div>

          <p><strong>Описание:</strong></p>
          <p style={{
            color: '#555',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
            textAlign: 'justify'
          }}>
            {film.description || 'Описание отсутствует.'}
          </p>
        </div>
      </div>

      {/* Кнопка "Купить билет" */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setShowHallScheme(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d00713'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e50914'}
        >
          🎟️ Купить билет
        </button>
      </div>

      {/* Модальное окно выбора сеанса */}
      {showHallScheme && (
        <HallScheme
          screenings={screenings}
          film={film}
          onClose={() => setShowHallScheme(false)}
          onSelectSession={(session) => {
            // Переход к выбору мест в зале
            console.log('Выбран сеанс:', session);
            window.location.href = `/tickets?screening_id=${session.screening_id}`;
          }}
        />
      )}
    </div>
  );
}