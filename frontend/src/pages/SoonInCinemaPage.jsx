import { useState } from 'react';
import HallScheme from '../components/tickets/HallScheme';

export default function SoonInCinemaPage() {
  const [showHallScheme, setShowHallScheme] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

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
      release_date: '2025-09-30'
    },
    {
      film_id: 103,
      title: 'Богема',
      genre_name: 'Драма',
      duration_min: 95,
      avg_rating: 8.1,
      poster_url: '/posters/coming/103.jpg',
      description: 'Опера Витторио Григоло и заснеженный Париж – на жаркой итальянской сцене Пуччини о любви и трагедии. Магический ансамбль дивных оперных голосов (Витторио Григоло, Джулиана Григорян, Лука Микелетти, Элеонора Беллоччи и Александр Виноградов) тёплым августовским вечером переносит нас в один из самых знаменитых рождественских вечеров в истории театра – в сочельник «Богемы».',
      release_date: '2025-09-30'
    },
    {
      film_id: 104,
      title: 'Мунк в аду',
      genre_name: 'Триллер',
      duration_min: 105,
      avg_rating: 7.6,
      poster_url: '/posters/coming/104.jpg',
      description: '«Крик» во тьме: как искусство Эдварда Мунка преодолевало косность публики История одного из главных художников XX века Эдварда Мунка. Создатель знаменитого «Крика», он пожертвовал городу Осло дело всей своей жизни – несколько тысяч картин, рисунков и гравюр. Но если при жизни соотечественники часто подвергали его жестокой критике, то после смерти он стал жертвой бюрократии и равнодушия ',
      release_date: '2025-09-30'
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

  const handleFilmClick = (film) => {
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
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                width: '200px'
              }}
            />
            <button style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              
            </button>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
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
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Афиша
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Скоро в кино
        </button>
        <button
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

      {/* Фильмы "Скоро в кино" */}
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
                <p>Рейтинг: ⭐ {film.avg_rating?.toFixed(1) || 'Нет'}</p>
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

      {/* Всплывающее окно */}
      {showHallScheme && selectedFilm && (
        <HallScheme
          film={selectedFilm}
          selectedDay="today"
          onClose={() => setShowHallScheme(false)}
          onSelectSession={(session) => {
            console.log('Выбран сеанс:', session);
            alert(`Билет на фильм "${selectedFilm.title}" будет доступен позже`);
          }}
        />
      )}
    </div>
  );
}