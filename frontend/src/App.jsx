// src/App.jsx
import { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import { getFilms } from './services/api';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComingSoonPage from './pages/ComingSoonPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState('today');
  const [showCalendar, setShowCalendar] = useState(false);

  // Проверяем токен
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          first_name: payload.first_name || 'Пользователь',
          role_id: payload.role_id,
          user_id: payload.user_id
        });
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  // Загружаем фильмы
  useEffect(() => {
    getFilms({ search })
      .then(data => {
        // Если данных мало — добавим фиктивные
        const mockFilms = [
          { film_id: 10, title: 'На высоте страха', genre_name: 'Драма', duration_min: 115, avg_rating: 7.8 },
          { film_id: 11, title: 'Дракула', genre_name: 'Комедия', duration_min: 95, avg_rating: 6.9 },
          { film_id: 12, title: 'Пункт назначения', genre_name: 'Ужасы', duration_min: 102, avg_rating: 7.2 },
          { film_id: 13, title: 'Астрал посместья ужаса', genre_name: 'Фантастика', duration_min: 130, avg_rating: 8.1 },
          { film_id: 14, title: 'Зверо-поезд', genre_name: 'Мультфильм', duration_min: 88, avg_rating: 7.5 },
          { film_id: 15, title: 'Альтер', genre_name: 'Боевик', duration_min: 125, avg_rating: 7.9 },
          { film_id: 16, title: 'Август', genre_name: 'Триллер', duration_min: 108, avg_rating: 7.4 },
          { film_id: 17, title: 'Тогда. Сейчас. Потом', genre_name: 'Романтика', duration_min: 100, avg_rating: 6.8 },
          { film_id: 18, title: 'Сомнения: обитель кошмаров', genre_name: 'Детектив', duration_min: 118, avg_rating: 7.7 },
          { film_id: 19, title: 'Пролетая над гнездом кукушки', genre_name: 'Приключения', duration_min: 140, avg_rating: 8.3 }
        ];

        const allFilms = [...(Array.isArray(data) ? data : []), ...mockFilms];
        setFilms(allFilms);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов:', err);
        // Если ошибка — покажем хотя бы фиктивные данные
        const mockFilms = [
          { film_id: 1, title: 'Фильм 1', genre_name: 'Боевик', duration_min: 120, avg_rating: 8.0 },
          { film_id: 2, title: 'Фильм 2', genre_name: 'Комедия', duration_min: 105, avg_rating: 7.1 },
          { film_id: 3, title: 'Фильм 3', genre_name: 'Драма', duration_min: 135, avg_rating: 8.5 },
          { film_id: 4, title: 'Фильм 4', genre_name: 'Фантастика', duration_min: 150, avg_rating: 8.7 },
          { film_id: 5, title: 'Фильм 5', genre_name: 'Ужасы', duration_min: 95, avg_rating: 6.5 },
          { film_id: 6, title: 'Фильм 6', genre_name: 'Мультфильм', duration_min: 90, avg_rating: 7.3 },
          { film_id: 7, title: 'Фильм 7', genre_name: 'Триллер', duration_min: 110, avg_rating: 7.6 },
          { film_id: 8, title: 'Фильм 8', genre_name: 'Романтика', duration_min: 102, avg_rating: 7.0 },
          { film_id: 9, title: 'Фильм 9', genre_name: 'Детектив', duration_min: 120, avg_rating: 8.2 },
          ...Array.from({ length: 10 }, (_, i) => ({
            film_id: 10 + i,
            title: `Фильм ${10 + i}`,
            genre_name: ['Боевик', 'Комедия', 'Драма', 'Фантастика', 'Ужасы', 'Мультфильм'][i % 6],
            duration_min: 90 + (i * 5),
            avg_rating: 6.5 + (i % 4) * 0.3
          }))
        ];
        setFilms(mockFilms);
        setLoading(false);
      });
  }, [search]);

  // Фильмы для карусели (первые 4)
  const carouselFilms = films.slice(0, 4);

  // Фильмы для "Скоро в кино"
  const comingSoon = [
    { film_id: 101, title: 'Всеведущий читатель', genre_name: 'Фантастика', duration_min: 120, avg_rating: 8.5 },
    { film_id: 102, title: 'Нанкинский фотограф', genre_name: 'Боевик', duration_min: 110, avg_rating: 7.9 },
    { film_id: 103, title: 'Богема', genre_name: 'Драма', duration_min: 95, avg_rating: 8.1 },
    { film_id: 104, title: 'Мунк в аду', genre_name: 'Триллер', duration_min: 105, avg_rating: 7.6 },
    { film_id: 105, title: 'Ложные  признания', genre_name: 'Приключения', duration_min: 130, avg_rating: 8.3 }
  ];

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                width: '200px'
              }}
            />
            <button
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔍
            </button>
          </div>
          {user ? (
            <button
              onClick={() => window.location.href = '/my-tickets'}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Личный кабинет
            </button>
          ) : (
            <button
              onClick={() => document.getElementById('login-modal').style.display = 'block'}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Войти
            </button>
          )}
        </div>
      </header>

      {/* Карусель */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        {carouselFilms.length > 0 ? (
          <img
            src={`/posters/${carouselFilms[0].film_id}.jpg`}
            alt={carouselFilms[0].title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '12px'
          }}>
            Нет фильмов
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {carouselFilms.map((_, i) => (
            <div key={i} style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: i === 0 ? '#fff' : '#aaa',
              cursor: 'pointer'
            }} />
          ))}
        </div>
      </div>

      {/* Кнопки выбора дня */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        justifyContent: 'center'
      }}>
        {['today', 'tomorrow'].map((day) => (
          <button
            key={day}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedDay === day ? '#007bff' : '#fff',
              color: selectedDay === day ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => {
              setSelectedDay(day);
              setShowCalendar(false);
            }}
          >
            {day === 'today' ? 'Сегодня' : 'Завтра'}
          </button>
        ))}
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: selectedDay === 'custom' ? '#007bff' : '#fff',
            color: selectedDay === 'custom' ? 'white' : '#333',
            border: '1px solid #007bff',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          onClick={() => {
            setSelectedDay('custom');
            setShowCalendar(true);
          }}
        >
          Выбрать день
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0-.06 3.58-.06 8c0 4.41 3.58 8 8 8s8-3.59 8-8c0-4.41-3.58-8-8-8zM8 14C4.41 14 2 11.59 2 8S4.41 2 8 2s6 2.41 6 6-2.41 6-6 6z"/>
            <path d="M8 6v4l3 2H5L8 6z"/>
          </svg>
        </button>
      </div>

      {/* Календарь */}
      {showCalendar && (
        <Calendar
          onClose={() => setShowCalendar(false)}
          onSelectDate={(date) => {
            console.log('Выбранная дата:', date.toISOString().split('T')[0]);
            setShowCalendar(false);
          }}
        />
      )}

      {/* Кнопки: Афиша, Скоро в кино, Расписание */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Афиша</button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Скоро в кино</button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#ffc107',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Расписание</button>
      </div>

      {/* ОСНОВНАЯ АФИША */}
      <div style={{ marginBottom: '50px' }}>
        <h2> Сейчас в кино</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {loading ? (
            <p>Загрузка фильмов...</p>
          ) : (
            films.map(film => (
              <div key={film.film_id} style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff'
              }}>
                <img
                  src={`/posters/${film.film_id}.jpg`}
                  alt={film.title}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '16px' }}>
                  <h3>{film.title}</h3>
                  <p>Жанр: {film.genre_name}</p>
                  <p>Длительность: {film.duration_min} мин</p>
                  <p>Рейтинг: ⭐ {typeof film.avg_rating === 'number' ? film.avg_rating.toFixed(1) : 'Нет'}</p>
                  <div style={{ marginTop: '15px' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px'
                      }}
                      onClick={() => window.location.href = `/film/${film.film_id}`}
                    >
                      Описание
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e50914',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = '/tickets'}
                    >
                      Купить билет
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* СКОРО В КИНО */}
      <div style={{ marginBottom: '50px' }}>
        <h2> Скоро в кино</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {comingSoon.map(film => (
            <div key={film.film_id} style={{
              width: '300px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>
              <img
                src={`/posters/coming/${film.film_id}.jpg`}
                alt={film.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '16px' }}>
                <h3>{film.title}</h3>
                <p>Жанр: {film.genre_name}</p>
                <p>Длительность: {film.duration_min} мин</p>
                <p>Рейтинг: ⭐ {film.avg_rating.toFixed(1)}</p>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Футер */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #ddd',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>&copy; 2025 КиноМир. Все права защищены.</p>
        <p>Томск • +7 (777) 777-77-77 • info@kinomir.ru</p>
      </footer>

      {/* Модальное окно входа */}
      <div id="login-modal" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '300px'
        }}>
          <button
            onClick={() => document.getElementById('login-modal').style.display = 'none'}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <LoginForm onLogin={setUser} />
        </div>
      </div>
    </div>
  );
}