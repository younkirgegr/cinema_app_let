// src/AppContent.jsx
import { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import { getFilms } from './services/api';
import HallScheme from './components/tickets/HallScheme';

export default function AppContent() {
  const [user, setUser] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState('today');
  const [showHallScheme, setShowHallScheme] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  // Проверяем токен при загрузке
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

  // Загружаем фильмы из API
  useEffect(() => {
    getFilms({ search })
      .then(data => {
        if (Array.isArray(data)) {
          // Убираем дубликаты по film_id
          const uniqueFilms = Array.from(new Map(data.map(film => [film.film_id, film])).values());
          setFilms(uniqueFilms);
        } else {
          setFilms([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов:', err);
        setFilms([]);
        setLoading(false);
      });
  }, [search]);

  // Фиксированный список "Скоро в кино"
  const comingSoon = [
    {
      film_id: 101,
      title: 'Всеведущий читатель',
      genre_name: 'Фантастика',
      duration_min: 120,
      avg_rating: 8.5,
      poster_url: '/posters/coming/101.jpg',
      description: 'История о человеке, который может читать мысли других.'
    },
    {
      film_id: 102,
      title: 'Нанкинский фотограф',
      genre_name: 'Боевик',
      duration_min: 110,
      avg_rating: 7.9,
      poster_url: '/posters/coming/102.jpg',
      description: 'Драма о жизни китайского фотографа во время войны.'
    },
    {
      film_id: 103,
      title: 'Богема',
      genre_name: 'Драма',
      duration_min: 95,
      avg_rating: 8.1,
      poster_url: '/posters/coming/103.jpg',
      description: 'Опера Джакомо Пуччини о любви и трагедии.'
    },
    {
      film_id: 104,
      title: 'Мунк в аду',
      genre_name: 'Триллер',
      duration_min: 105,
      avg_rating: 7.6,
      poster_url: '/posters/coming/104.jpg',
      description: 'Психологический триллер о художнике Эдварде Мунке.'
    },
    {
      film_id: 105,
      title: 'Ложные признания',
      genre_name: 'Приключения',
      duration_min: 130,
      avg_rating: 8.3,
      poster_url: '/posters/coming/105.jpg',
      description: 'История о человеке, который вынужден признаться в преступлении.'
    }
  ];

  // Обработчик клика на постер
  const handleFilmClick = (film) => {
    // Проверка: показ ещё идёт?
    const today = new Date();
    const endDate = new Date(film.end_date);
    if (today > endDate) {
      alert(`Показ фильма "${film.title}" завершён`);
      return;
    }

    setSelectedFilm(film);
    setShowHallScheme(true);
  };

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
        {films.length > 0 ? (
          <img
            src={films[0]?.poster_url || '/posters/1.jpg'}
            alt={films[0]?.title || 'Карусель'}
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
            onClick={() => setSelectedDay(day)}
          >
            {day === 'today' ? 'Сегодня' : 'Завтра'}
          </button>
        ))}
      </div>

      {/* ОСНОВНАЯ АФИША */}
      <div style={{ marginBottom: '50px' }}>
        <h2>🎬 Сейчас в кино</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {loading ? (
            <p>Загрузка фильмов...</p>
          ) : films.length === 0 ? (
            <p>Нет фильмов в прокате</p>
          ) : (
            films.map(film => (
              <div
                key={film.film_id}
                onClick={() => handleFilmClick(film)}
                style={{
                  width: '300px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
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
                  <p>
                    Рейтинг: ⭐ {film.avg_rating ? film.avg_rating.toFixed(1) : 'Нет'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* СКОРО В КИНО */}
      <div style={{ marginBottom: '50px' }}>
        <h2>🔜 Скоро в кино</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {comingSoon.map(film => (
            <div
              key={film.film_id}
              onClick={() => handleFilmClick(film)}
              style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              <img
                src={film.poster_url}
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
                <p>
                  Рейтинг: ⭐ {film.avg_rating?.toFixed(1) || 'Нет'}
                </p>
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
        <p>Томск • +7 (910) 111-22-33 • info@kinomir.ru</p>
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

      {/* Всплывающее окно выбора сеанса */}
      {showHallScheme && selectedFilm && (
        <HallScheme
          film={selectedFilm}
          selectedDay={selectedDay}
          onClose={() => setShowHallScheme(false)}
          onSelectSession={(session) => {
            console.log('Выбран сеанс:', session);
            window.location.href = `/tickets?screening_id=${session.screening_id}`;
          }}
        />
      )}
    </div>
  );
}