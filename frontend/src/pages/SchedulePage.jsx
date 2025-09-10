// src/pages/SchedulePage.jsx
import { useState, useEffect } from 'react';
import { getFilmsWithScreenings } from '../services/api';

export default function SchedulePage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('today');

  // Загружаем фильмы с сеансами
  useEffect(() => {
    getFilmsWithScreenings(selectedDay)
      .then(data => {
        if (Array.isArray(data)) {
          // Сортируем по времени начала сеанса
          data.sort((a, b) => {
            const timeA = a.screenings[0]?.start_time || '';
            const timeB = b.screenings[0]?.start_time || '';
            return timeA.localeCompare(timeB);
          });
          setFilms(data);
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки расписания:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDay]);

  // Фильтрация по дате
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredFilms = films.filter(film => {
    return film.screenings.some(session => {
      const sessionDate = session.start_time.split(' ')[0];
      return (selectedDay === 'today' && sessionDate === today) ||
             (selectedDay === 'tomorrow' && sessionDate === tomorrow);
    });
  });

  if (loading) return <p>Загрузка расписания...</p>;

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
          <img src="/logo.png" alt="Логотип" style={{ width: '60px', height: '60px' }} />
          <h1 style={{ margin: '0', fontSize: '28px', color: '#333' }}>КиноМир</h1>
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
          На главную
        </button>
      </header>

      {/* Баннер */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <img
          src="/posters/banner.jpg"
          alt="Баннер"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '20px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '12px',
          maxWidth: '600px'
        }}>
          <h2 style={{ margin: '0', fontSize: '48px' }}>Дракула</h2>
          <p style={{ margin: '10px 0', fontSize: '18px' }}>
            Новый блокбастер Люка Бессона
          </p>
          <p style={{ margin: '10px 0', fontSize: '18px' }}>
            В кино с 11 сентября
          </p>
        </div>
      </div>

      {/* Кнопки выбора дня */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
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

      {/* Расписание */}
      <h2 style={{ marginBottom: '20px' }}>📅 Расписание</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {filteredFilms.length === 0 ? (
          <p>На выбранный день нет сеансов</p>
        ) : (
          filteredFilms.map(film => (
            <div key={film.film_id} style={{
              width: '300px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <img
                src={`/posters/${film.film_id}.jpg`}
                alt={film.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '16px' }}>
                <h3>{film.title}</h3>
                <p><strong>Жанр:</strong> {film.genre_name}</p>
                <p><strong>Длительность:</strong> {film.duration_min} мин</p>
                <p><strong>Рейтинг:</strong> ⭐ {film.avg_rating ? film.avg_rating.toFixed(1) : 'Нет'}</p>
                <p><strong>Описание:</strong></p>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{film.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Футер */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #ddd',
        color: '#666',
        fontSize: '14px',
        marginTop: '50px'
      }}>
        <p>&copy; 2025 КиноМир. Все права защищены.</p>
      </footer>
    </div>
  );
}