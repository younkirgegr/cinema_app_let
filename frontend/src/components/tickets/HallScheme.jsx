import { useState, useEffect } from 'react';
import { getScreeningsByFilmId } from '../../services/api';

export default function HallScheme({ film, onClose, onSelectSession }) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('today'); 

  // Загружаем сеансы
  useEffect(() => {
    getScreeningsByFilmId(film.film_id)
      .then(data => {
        console.log('Все сеансы из API:', data); 
        setScreenings(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Ошибка загрузки сеансов:', err);
      })
      .finally(() => setLoading(false));
  }, [film.film_id]);

  const today = new Date().toISOString().split('T')[0]; 
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]; 

  const filteredSessions = screenings.filter(session => {
    if (!session.start_time) return false;
    const sessionDate = session.start_time.split('T')[0]; 
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

        {/* Описание фильма */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          {/* Постер */}
          <img
            src={`/posters/${film.film_id}.jpg`}
            alt={film.title}
            style={{
              width: '200px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid #ddd'
            }}
          />

          {/* Информация и описание */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '350px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{film.title}</h3>

            <p><strong>Жанр:</strong> {film.genre_name}</p>
            <p><strong>Длительность:</strong> {film.duration_min} мин</p>
            <p><strong>Рейтинг:</strong> ⭐ {film.avg_rating ? film.avg_rating.toFixed(1) : 'Нет'}</p>

            <div style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <strong>Описание:</strong>
              <p style={{ margin: '8px 0 0 0', color: '#495057' }}>
                {film.description || 'Описание фильма временно недоступно.'}
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки выбора дня */}
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
            onClick={() => setSelectedDay('today')}
          >
            Сегодня
          </button>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: selectedDay === 'tomorrow' ? '#007bff' : '#fff',
              color: selectedDay === 'tomorrow' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => setSelectedDay('tomorrow')}
          >
            Завтра
          </button>
        </div>

        {/* Сеансы */}
        <h3> Сеансы</h3>
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
            На сегодня и завтра нет сеансов
          </p>
        )}

      </div>
    </div>
  );
}