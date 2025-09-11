import { useState, useEffect } from 'react';
import { getFilms, addFilm, updateFilm, deleteFilm } from '../services/api';

export default function AdminPanel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingFilm, setEditingFilm] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Загружаем фильмы
  useEffect(() => {
    getFilms({ search })
      .then(data => {
        const enrichedFilms = (Array.isArray(data) ? data : []).map(film => ({
          ...film,
          release_date: film.release_date || '2025-01-01',
          description: film.description || 'Нет описания',
          poster_url: film.poster_url || `/posters/${film.film_id}.jpg`,
          hall_names: film.hall_names || 'Зал 1, Зал 2',
          genre_names: film.genre_name || 'Неизвестно'
        }));
        setFilms(enrichedFilms);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов:', err);
        setFilms([]);
        setLoading(false);
      });
  }, [search]);

  // Добавление фильма
  const handleAddFilm = (data) => {
    addFilm(data)
      .then(newFilm => {
        const enrichedFilm = {
          ...newFilm,
          hall_names: 'Зал 1, Зал 2',
          genre_names: data.genre_name || 'Неизвестно'
        };
        setFilms(prev => [...prev, enrichedFilm]);
        setShowForm(false);
      })
      .catch(err => {
        alert('Ошибка при добавлении фильма');
      });
  };

  // Обновление фильма
  const handleUpdateFilm = (filmId, data) => {
    updateFilm(filmId, data)
      .then(updatedFilm => {
        setFilms(prev => prev.map(f => f.film_id === filmId ? {
          ...updatedFilm,
          hall_names: f.hall_names,
          genre_names: f.genre_names
        } : f));
        setEditingFilm(null);
        setShowForm(false);
      })
      .catch(err => {
        alert('Ошибка при обновлении фильма');
      });
  };

  // Удаление фильма
  const handleDeleteFilm = (filmId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот фильм?')) {
      deleteFilm(filmId)
        .then(() => {
          setFilms(prev => prev.filter(f => f.film_id !== filmId));
        })
        .catch(err => {
          alert('Ошибка при удалении фильма');
        });
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px',
      minWidth: '1024px'
    }}>
      {/* Навигация */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Афиша
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Расписание
        </button>
      </div>

      {/* Поиск и кнопка добавления */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => {
            setEditingFilm(null);
            setShowForm(true);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 'bold'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0-.06 3.58-.06 8c0 4.41 3.58 8 8 8s8-3.59 8-8c0-4.41-3.58-8-8-8zM8 14C4.41 14 2 11.59 2 8S4.41 2 8 2s6 2.41 6 6-2.41 6-6 6z"/>
            <path d="M8 6v4l3 2H5L8 6z"/>
          </svg>
          ФИЛЬМ
        </button>
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
      </div>

      {/* Список фильмов */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {loading ? (
          <p>Загрузка фильмов...</p>
        ) : films.length === 0 ? (
          <p>Нет фильмов</p>
        ) : (
          films.map(film => (
            <div key={film.film_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <img
                src={film.poster_url}
                alt={film.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{film.title}</h3>
                <p><strong>В прокате:</strong> {film.release_date}</p>
                <p><strong>Залы:</strong> {film.hall_names}</p>
                <p><strong>Продолжительность:</strong> {film.duration_min} мин</p>
                <p><strong>Жанры:</strong> {film.genre_names}</p>
                <p><strong>Описание:</strong> {film.description}</p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setEditingFilm(film);
                      setShowForm(true);
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteFilm(film.film_id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Кнопка "Добавить новый фильм" внизу */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={() => {
            setEditingFilm(null);
            setShowForm(true);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0-.06 3.58-.06 8c0 4.41 3.58 8 8 8s8-3.59 8-8c0-4.41-3.58-8-8-8zM8 14C4.41 14 2 11.59 2 8S4.41 2 8 2s6 2.41 6 6-2.41 6-6 6z"/>
            <path d="M8 6v4l3 2H5L8 6z"/>
          </svg>
          Добавить новый фильм
        </button>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {showForm && (
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
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingFilm(null);
              }}
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
            <h2 style={{ marginTop: '0' }}>
              {editingFilm ? 'Редактировать фильм' : 'Добавить фильм'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());

              if (editingFilm) {
                handleUpdateFilm(editingFilm.film_id, data);
              } else {
                handleAddFilm(data);
              }
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Название:</label>
                <input
                  name="title"
                  defaultValue={editingFilm?.title}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Жанр:</label>
                <select
                  name="genre_id"
                  defaultValue={editingFilm?.genre_id || ''}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">Выберите жанр</option>
                  <option value="1">Боевик</option>
                  <option value="2">Комедия</option>
                  <option value="3">Драма</option>
                  <option value="4">Фантастика</option>
                  <option value="5">Ужасы</option>
                  <option value="6">Мультфильм</option>
                  <option value="7">Триллер</option>
                  <option value="8">Приключения</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Продолжительность (мин):</label>
                <input
                  name="duration_min"
                  type="number"
                  defaultValue={editingFilm?.duration_min}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Рейтинг (0–10):</label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  defaultValue={editingFilm?.rating}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Описание:</label>
                <textarea
                  name="description"
                  defaultValue={editingFilm?.description}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Дата выхода:</label>
                <input
                  name="release_date"
                  type="date"
                  defaultValue={editingFilm?.release_date || '2025-01-01'}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Постер URL:</label>
                <input
                  name="poster_url"
                  defaultValue={editingFilm?.poster_url || `/posters/${editingFilm?.film_id || '1'}.jpg`}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingFilm ? 'Сохранить изменения' : 'Добавить фильм'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}