// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { getFilms, getHalls, addFilm, createScreening } from '../services/api';

export default function AdminPage() {
  const [films, setFilms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка фильмов и залов
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const filmsData = await getFilms();
        const hallsData = await getHalls();
        setFilms(Array.isArray(filmsData) ? filmsData : []);
        setHalls(Array.isArray(hallsData) ? hallsData : []);
      } catch (err) {
        alert('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  // Форма добавления фильма
  const [showAddFilmForm, setShowAddFilmForm] = useState(false);
  const [newFilm, setNewFilm] = useState({
    title: '',
    genre_id: '',
    duration_min: '',
    rating: '',
    description: ''
  });

  const handleAddFilm = async () => {
    try {
      await addFilm(newFilm);
      alert('Фильм добавлен!');
      setNewFilm({ title: '', genre_id: '', duration_min: '', rating: '', description: '' });
      setShowAddFilmForm(false);
    } catch (err) {
      alert('Ошибка при добавлении фильма');
    }
  };

  // Форма создания сеанса
  const [showCreateSessionForm, setShowCreateSessionForm] = useState(false);
  const [sessionData, setSessionData] = useState({
    film_id: '',
    hall_id: '',
    start_time: '',
    base_price: ''
  });

  const handleCreateSession = async () => {
    try {
      await createScreening(sessionData);
      alert('Сеанс создан!');
      setSessionData({ film_id: '', hall_id: '', start_time: '', base_price: '' });
      setShowCreateSessionForm(false);
    } catch (err) {
      alert('Ошибка при создании сеанса');
    }
  };

  if (loading) return <p>Загрузка админки...</p>;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e50914',
        paddingBottom: '10px'
      }}>
        <h1 style={{ color: '#e50914' }}>🎬 Админ-панель</h1>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← На главную
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Управление фильмами */}
        <div style={cardStyle}>
          <h2>🎥 Фильмы</h2>
          <button
            onClick={() => setShowAddFilmForm(true)}
            style={btnPrimary}
          >
            + Добавить фильм
          </button>
          <ul style={{ marginTop: '15px' }}>
            {films.map(f => (
              <li key={f.film_id} style={listItem}>
                {f.title} ({f.duration_min} мин)
                <div>
                  <button style={{ ...btnSmall, marginRight: '5px' }}>✏️ Редактировать</button>
                  <button style={{ ...btnSmall, backgroundColor: '#dc3545' }}>🗑 Удалить</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Управление сеансами */}
        <div style={cardStyle}>
          <h2>📅 Сеансы</h2>
          <button
            onClick={() => setShowCreateSessionForm(true)}
            style={btnPrimary}
          >
            + Назначить сеанс
          </button>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            Здесь можно создать новый сеанс:
          </p>
          <form style={{ marginTop: '10px' }}>
            <select
              value={sessionData.film_id}
              onChange={(e) => setSessionData({ ...sessionData, film_id: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="">Выберите фильм</option>
              {films.map(f => <option key={f.film_id} value={f.film_id}>{f.title}</option>)}
            </select>
            <select
              value={sessionData.hall_id}
              onChange={(e) => setSessionData({ ...sessionData, hall_id: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="">Выберите зал</option>
              {halls.map(h => <option key={h.hall_id} value={h.hall_id}>{h.hall_name}</option>)}
            </select>
            <input
              type="datetime-local"
              value={sessionData.start_time}
              onChange={(e) => setSessionData({ ...sessionData, start_time: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              placeholder="Цена билета"
              value={sessionData.base_price}
              onChange={(e) => setSessionData({ ...sessionData, base_price: e.target.value })}
              step="50"
              min="100"
              style={inputStyle}
              required
            />
            <button type="submit" onClick={handleCreateSession} style={btnSuccess}>
              ✅ Создать сеанс
            </button>
          </form>
        </div>
      </div>

      {/* Модальные окна */}
      {showAddFilmForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '600px'
          }}>
            <h2>➕ Добавить фильм</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddFilm(); }}>
              <div style={{ marginBottom: '15px' }}>
                <label>Название:</label>
                <input
                  name="title"
                  value={newFilm.title}
                  onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Жанр:</label>
                <select
                  name="genre_id"
                  value={newFilm.genre_id}
                  onChange={(e) => setNewFilm({ ...newFilm, genre_id: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Выберите жанр</option>
                  <option value="1">Боевик</option>
                  <option value="2">Комедия</option>
                  <option value="3">Драма</option>
                  <option value="4">Фантастика</option>
                  <option value="5">Ужасы</option>
                  <option value="6">Мультфильм</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Продолжительность (мин):</label>
                <input
                  type="number"
                  name="duration_min"
                  value={newFilm.duration_min}
                  onChange={(e) => setNewFilm({ ...newFilm, duration_min: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Рейтинг:</label>
                <input
                  name="rating"
                  value={newFilm.rating}
                  onChange={(e) => setNewFilm({ ...newFilm, rating: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Описание:</label>
                <textarea
                  name="description"
                  value={newFilm.description}
                  onChange={(e) => setNewFilm({ ...newFilm, description: e.target.value })}
                  rows="4"
                  style={inputStyle}
                ></textarea>
              </div>
              <button type="submit" style={btnSuccess}>Создать фильм</button>
              <button type="button" onClick={() => setShowAddFilmForm(false)} style={{ marginLeft: '10px' }}>
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Стили
const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  height: 'fit-content'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const btnPrimary = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginBottom: '15px'
};

const btnSuccess = {
  ...btnPrimary,
  backgroundColor: '#28a745'
};

const btnSmall = {
  padding: '5px 10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const listItem = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px dashed #ddd'
};