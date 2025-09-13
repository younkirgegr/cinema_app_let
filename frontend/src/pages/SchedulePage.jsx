// src/pages/SchedulePage.jsx
import { useState, useEffect } from 'react';
import { getSchedule } from '../services/api';

export default function SchedulePage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('today');

  useEffect(() => {
    console.log(`[SchedulePage] Загрузка расписания для ${selectedDay}...`);
    setLoading(true);
    setError('');

    getSchedule(selectedDay)
      .then(data => {
        console.log(`[SchedulePage] Получено ${data.length} фильмов`);
        if (Array.isArray(data)) {
          // Сортируем фильмы по времени первого сеанса
          const sortedData = [...data].sort((a, b) => {
            const timeA = a.screenings[0]?.start_time || '9999-12-31';
            const timeB = b.screenings[0]?.start_time || '9999-12-31';
            return timeA.localeCompare(timeB);
          });
          setFilms(sortedData);
        } else {
          setFilms([]);
        }
      })
      .catch(err => {
        console.error('[SchedulePage] Ошибка загрузки:', err);
        setError('Не удалось загрузить расписание. Попробуйте позже.');
        setFilms([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDay]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px',
      minWidth: '1024px'
    }}>
      {/* Шапка */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ margin: '0', fontSize: '28px', color: '#333' }}>📅 Расписание</h1>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← На главную
        </button>
      </header>

      {/* Выбор дня */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setSelectedDay('today')}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedDay === 'today' ? '#007bff' : '#fff',
            color: selectedDay === 'today' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Сегодня ({formatDate(today)})
        </button>
        <button
          onClick={() => setSelectedDay('tomorrow')}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedDay === 'tomorrow' ? '#007bff' : '#fff',
            color: selectedDay === 'tomorrow' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Завтра ({formatDate(tomorrow)})
        </button>
      </div>

      {/* Загрузка / Ошибка */}
      {loading && <p style={{ textAlign: 'center' }}>Загрузка расписания...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* Расписание */}
      {!loading && !error && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {films.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%' }}>
              На {selectedDay === 'today' ? 'сегодня' : 'завтра'} сеансов нет
            </p>
          ) : (
            films.map(film => (
              <div key={film.film_id} style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={film.poster_url || `/posters/${film.film_id}.jpg`}
                  alt={film.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{film.title}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Жанр:</strong> {film.genre_name}</p>
                  <p style={{ margin: '5px 0' }}><strong>Длительность:</strong> {film.duration_min} мин</p>
                  
                  <h4 style={{ margin: '15px 0 10px 0' }}>Сеансы:</h4>
                  {film.screenings && film.screenings.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      justifyContent: 'flex-start'
                    }}>
                      {film.screenings.map((session, idx) => (
                        <div key={idx} style={{
                          padding: '6px 10px',
                          backgroundColor: '#e9ecef',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}>
                          <div><strong>{formatTime(session.start_time)}</strong></div>
                          <div>{session.hall_name}</div>
                          <div>{session.base_price} ₽</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Нет сеансов</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Футер */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #ddd',
        color: '#666',
        fontSize: '14px',
        marginTop: '40px'
      }}>
        <p>&copy; 2025 КиноМир. Все права защищены.</p>
      </footer>
    </div>
  );
}