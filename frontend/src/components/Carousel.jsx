// src/components/Carousel.jsx
import { useState, useEffect } from 'react';

export default function Carousel({ films }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Автопрокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % films.length);
    }, 5000); // Каждые 5 секунд
    return () => clearInterval(interval);
  }, [films.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? films.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % films.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (films.length === 0) return null;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      overflow: 'hidden',
      borderRadius: '12px',
      marginBottom: '30px'
    }}>
      {/* Слайды */}
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          height: '100%'
        }}
        onWheel={(e) => {
          if (e.deltaY > 0) goToNext();
          else goToPrev();
        }}
      >
        {films.map((film, index) => (
          <div
            key={film.film_id}
            style={{
              minWidth: '100%',
              height: '100%',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <img
              src={`/posters/${film.film_id}.jpg`}
              alt={film.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '8px',
              maxWidth: '400px'
            }}>
              <h2 style={{ margin: '0', fontSize: '24px' }}>{film.title}</h2>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                {film.genre_name} • {film.duration_min} мин • ⭐ {film.avg_rating?.toFixed(1) || 'Нет'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Стрелка влево */}
      <button
        onClick={goToPrev}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 10
        }}
      >
        ◀
      </button>

      {/* Стрелка вправо */}
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 10
        }}
      >
        ▶
      </button>

      {/* Индикаторы */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px'
      }}>
        {films.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? '#fff' : '#aaa',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}