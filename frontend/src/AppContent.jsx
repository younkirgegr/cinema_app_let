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
      film_id: 102,
      title: 'Нанкинский фотограф',
      genre_name: 'Боевик',
      duration_min: 110,
      avg_rating: 7.9,
      poster_url: '/posters/coming/102.jpg',
      description: 'Драма о жизни 1937 год, японцы захватывают Нанкин. Не успевший эвакуироваться местный почтальон А Чан выдает себя за сотрудника фотоателье, где занимается проявкой пленки для японских военных. Там же он обустраивает тайное убежище для группы мирных жителей и китайских солдат. Рискуя собственной жизнью, А Чан стремится переправить их в безопасное место, а также обнародовать фотодоказательства чудовищных преступлений японцев. фотографа во время войны.',
      release_date: '2025-09-18'
    },
    {
      film_id: 103,
      title: 'Богема',
      genre_name: 'Драма',
      duration_min: 95,
      avg_rating: 8.1,
      poster_url: '/posters/coming/103.jpg',
      description: 'Опера Витторио Григоло и заснеженный Париж – на жаркой итальянской сцене Пуччини о любви и трагедии. Магический ансамбль дивных оперных голосов (Витторио Григоло, Джулиана Григорян, Лука Микелетти, Элеонора Беллоччи и Александр Виноградов) тёплым августовским вечером переносит нас в один из самых знаменитых рождественских вечеров в истории театра – в сочельник «Богемы».',
      release_date: '2025-09-20'
    },
    {
      film_id: 104,
      title: 'Мунк в аду',
      genre_name: 'Триллер',
      duration_min: 105,
      avg_rating: 7.6,
      poster_url: '/posters/coming/104.jpg',
      description: '«Крик» во тьме: как искусство Эдварда Мунка преодолевало косность публики История одного из главных художников XX века Эдварда Мунка. Создатель знаменитого «Крика», он пожертвовал городу Осло дело всей своей жизни – несколько тысяч картин, рисунков и гравюр. Но если при жизни соотечественники часто подвергали его жестокой критике, то после смерти он стал жертвой бюрократии и равнодушия ',
      release_date: '2025-09-22'
    },
    {
      film_id: 105,
      title: 'Ложные признания',
      genre_name: 'Приключения',
      duration_min: 130,
      avg_rating: 8.3,
      poster_url: '/posters/coming/105.jpg',
      description: 'Виктория Исакова и Вера Алентова в «несмешной комедии» XVIII века со сцены театра Пушкина Стильная постановка Евгения Писарева о том, как сложно отличить настоящее чувство от искусной подделки. Хотя изящный сюжет этой комедии французский драматург Мариво придумал ещё в XVIII веке, он по-прежнему актуален.',
      release_date: '2025-09-25'
    }
  ];

  // Обработчик клика на постер
  const handleFilmClick = (film) => {
    // Проверка: фильм уже в прокате?
    const today = new Date();
    const releaseDate = new Date(film.release_date);

    // Если фильм ещё не вышел — всё равно открываем, но без кнопок покупки
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
        }}>
          Афиша
        </button>

        <button
          onClick={() => window.location.href = '/soon'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Скоро в кино
        </button>

        <button
            onClick={() => window.location.href = '/schedule'}
            style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
        }}
        >
            Расписание
            </button>
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
        <h2> Скоро в кино</h2>
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