// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import TicketsPage from './pages/TicketsPage';
import { getFilms } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  // Проверяем, есть ли токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ first_name: 'Пользователь' });
    }
  }, []);

  // Загружаем фильмы
  useEffect(() => {
    getFilms({ search, genre })
      .then(data => {
        setFilms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов:', err);
        setFilms([]);
        setLoading(false);
      });
  }, [search, genre]);

  const handleLogin = (userData) => {
    setUser(userData);
    document.getElementById('login-modal').style.display = 'none';
  };

  return (
    <Router>
      <div style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {/* Шапка */}
        <header style={{
          textAlign: 'right',
          marginBottom: '20px'
        }}>
          {user ? (
            <span>Привет, {user.first_name}!</span>
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
        </header>

        {/* Заголовок */}
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎬 Афиша кинотеатра
        </h1>

        {/* Фильтры */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '200px'
            }}
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '200px'
            }}
          >
            <option value="">Все жанры</option>
            <option value="1">Боевик</option>
            <option value="2">Комедия</option>
            <option value="3">Драма</option>
            <option value="4">Фантастика</option>
            <option value="5">Ужасы</option>
            <option value="6">Мультфильм</option>
          </select>
        </div>

        {/* Список фильмов */}
        {loading ? (
          <p>Загрузка фильмов...</p>
        ) : (
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {films.map(film => (
              <div key={film.film_id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                width: '200px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3>{film.title}</h3>
                <p>Жанр: {film.genre_name}</p>
                <p>Длительность: {film.duration_min} мин</p>
                <p>Рейтинг: {film.rating}</p>
                <p>⭐ {typeof film.avg_rating === 'number' ? film.avg_rating.toFixed(1) : 'Нет'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка "Выбрать место" */}
        <div style={{ marginTop: '30px' }}>
          <Link to="/tickets">
            <button
              style={{
                padding: '12px 24px',
                backgroundColor: '#e50914',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🎟️ Выбрать место
            </button>
          </Link>
        </div>

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
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>

        {/* Роуты */}
        <Routes>
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </div>
    </Router>
  );
}