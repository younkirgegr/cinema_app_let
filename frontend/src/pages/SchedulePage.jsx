import { useState, useEffect } from 'react';
import { getFilms } from '../services/api';
import { getScreeningsByFilmId } from '../services/api';

export default function SchedulePage() {
  const [films, setFilms] = useState([]);
  const [screenings, setScreenings] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('today');

  // Загружаем фильмы
  useEffect(() => {
    getFilms()
      .then(data => {
        if (Array.isArray(data)) {
          setFilms(data);
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов:', err);
      });
  }, []);

  // Загружаем все сеансы для всех фильмов
  useEffect(() => {
    if (films.length === 0) return;

    const loadAllScreenings = async () => {
      const allScreenings = [];

      for (const film of films) {
        try {
          const filmScreenings = await getScreeningsByFilmId(film.film_id);
          // Добавляем к каждому сеансу информацию о фильме
          const enrichedScreenings = filmScreenings.map(session => ({
            ...session,
            film_title: film.title,
            genre_name: film.genre_name,
            duration_min: film.duration_min,
            poster_url: film.poster_url
          }));
          allScreenings.push(...enrichedScreenings);
        } catch (err) {
          console.error(`Ошибка загрузки сеансов для фильма ${film.title}:`, err);
        }
      }

      // Сортируем все сеансы по времени начала
      const sorted = allScreenings.sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );

      setScreenings(sorted);
      setLoading(false);
    };

    loadAllScreenings();
  }, [films]);

  // Фильтрация по дню
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredScreenings = screenings.filter(session => {
    const sessionDate = session.start_time.split('T')[0]; // 'YYYY-MM-DD'
    return (
      (selectedDay === 'today' && sessionDate === today) ||
      (selectedDay === 'tomorrow' && sessionDate === tomorrow)
    );
  });

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Загрузка расписания...</p>;

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

      {/* Заголовок */}
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', color: '#333' }}>
        📅 Расписание сеансов (для кассира)
      </h2>

      {/* Список сеансов — теперь это вертикальный список */}

      {filteredScreenings.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', padding: '50px' }}>
          На выбранный день нет сеансов.
        </p>
      ) : (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '10px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        }}>
          {filteredScreenings.map(session => (
            <button
              key={session.screening_id}
              onClick={() => {
                window.location.href = `/tickets/${session.screening_id}`;
              }}
              style={{
                width: '100%',
                padding: '18px 20px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                marginBottom: '12px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#333'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateX(5px)' || (e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseOut={(e) => e.target.style.transform = 'translateX(0)' || (e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)')}
            >
              {/* Миниатюра постера */}
              <img
                src={session.poster_url || 'public/posters/default.jpg'}
                alt={session.film_title}
                style={{
                  width: '70px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              />
              

              {/* Информация */}
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '17px', marginBottom: '4px', color: '#222' }}>
                  {session.film_title}
                </strong>
                <div style={{ 
                  color: '#e50914', 
                  fontWeight: 'bold', 
                  fontSize: '15px',
                  marginBottom: '3px'
                }}>
                  {new Date(session.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ color: '#555', fontSize: '13px', marginBottom: '3px' }}>
                  {session.hall_name} • {session.base_price} ₽
                </div>
                <div style={{ color: '#777', fontSize: '12px' }}>
                  {session.genre_name} • {session.duration_min} мин
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
        <p>Для кассиров: выбирайте сеанс → покупайте билеты</p>
      </footer>
    </div>
  );
}