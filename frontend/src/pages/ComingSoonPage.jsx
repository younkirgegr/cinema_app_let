import { useState } from 'react';

export default function ComingSoonPage() {
  const [search, setSearch] = useState('');

  // Фильмы, которые скоро выйдут
  const comingSoon = [
    {
      film_id: 101,
      title: 'Мстители: Новое начало',
      genre_name: 'Фантастика',
      duration_min: 135,
      avg_rating: 8.7
    },
    {
      film_id: 102,
      title: 'Темный рыцарь: Возвращение',
      genre_name: 'Боевик',
      duration_min: 152,
      avg_rating: 9.1
    },
    {
      film_id: 103,
      title: 'Приключения в стране чудес',
      genre_name: 'Мультфильм',
      duration_min: 105,
      avg_rating: 7.9
    }
  ];

  // Фильтрация по поиску
  const filteredFilms = comingSoon.filter(film =>
    film.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px'
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
              
            </button>
          </div>
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
        </div>
      </header>

      {/* Заголовок */}
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎬 Скоро в кино</h2>

      {/* Список фильмов */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {filteredFilms.map(film => (
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
                onClick={() => window.location.href = `/film/${film.film_id}`}
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
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
        <p>Томск • +7 (910) 111-22-33 • info@kinomir.ru</p>
      </footer>
    </div>
  );
}
