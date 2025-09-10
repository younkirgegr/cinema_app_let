// src/components/tickets/HallScheme.jsx
import { useState, useEffect } from 'react';
import { getScreeningsByFilmId } from '../../services/api';

export default function HallScheme({ film, selectedDay, onClose, onSelectSession }) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScreeningsByFilmId(film.film_id)
      .then(data => {
        setScreenings(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Ошибка загрузки сеансов:', err);
        setScreenings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [film.film_id]);

  // Фильтрация по дате
  const today = new Date().toISOString().split('T')[0]; // '2025-04-05'
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredSessions = screenings.filter(session => {
    const sessionDate = session.start_time.split(' ')[0]; // '2025-04-05'
    return (selectedDay === 'today' && sessionDate === today) ||
          (selectedDay === 'tomorrow' && sessionDate === tomorrow);
  });
  const hasSessions = filteredSessions.length > 0;

  if (loading) return <p>Загрузка сеансов...</p>;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      display: 'flex'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '30px'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0', fontSize: '24px' }}>{film.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#555',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Описание */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <img
            src={film.poster_url}
            alt={film.title}
            style={{
              width: '200px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
          />
          <div>
            <p><strong>Жанр:</strong> {film.genre_name}</p>
            <p><strong>Длительность:</strong> {film.duration_min} мин</p>
            <p><strong>Рейтинг:</strong> ⭐ {film.avg_rating ? film.avg_rating.toFixed(1) : 'Нет'}</p>
            <p><strong>Описание:</strong></p>
            <p style={{ color: '#555', lineHeight: '1.6' }}>{film.description}</p>
          </div>
        </div>

        {/* Выбор дня */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: selectedDay === 'today' ? '#007bff' : '#fff',
              color: selectedDay === 'today' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => {}} // уже выбрано
          >
            Сегодня
          </button>
          <button
          onClick={() => setSelectedDay('tomorrow')}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedDay === 'tomorrow' ? '#007bff' : '#fff',
            color: selectedDay === 'tomorrow' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Завтра
        </button>
        </div>

        {/* Сеансы */}
        {hasSessions ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {filteredSessions.map((session, i) => (
              <button
                key={i}
                onClick={() => onSelectSession?.(session)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {session.start_time.slice(11, 16)}
                </div>
                <div style={{
                  backgroundColor: '#e50914',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  2D от {session.base_price} ₽
                  {session.is_vip && (
                    <span style={{
                      marginLeft: '4px',
                      fontSize: '10px',
                      backgroundColor: '#ffc107',
                      color: '#333',
                      padding: '1px 4px',
                      borderRadius: '3px'
                    }}>
                      VIP
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {session.hall_name}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '20px'
          }}>
            На выбранный день нет сеансов
          </p>
        )}

        {/* Кнопка "Купить билет" */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🎟️ Купить билет
          </button>
        </div>
      </div>
    </div>
  );
}