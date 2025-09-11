import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getScreeningDetails, getOccupiedSeats } from '../services/api';

export default function SelectSeatsPage() {
  const { screeningId } = useParams();
  const [hall, setHall] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных о сеансе и занятых местах
  useEffect(() => {
    const loadHallAndSeats = async () => {
      try {
        const hallData = await getScreeningDetails(screeningId);
        const occupied = await getOccupiedSeats(screeningId);

        console.log('Данные о сеансе:', hallData);
        console.log('Занятые места:', occupied);

        setHall(hallData);
        setOccupiedSeats(Array.isArray(occupied) ? occupied : []);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHallAndSeats();
  }, [screeningId]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return; // нельзя выбрать занятое

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Подсчёт суммы
  const totalPrice = selectedSeats.length * (hall?.base_price || 350);

  // Форматируем дату и время
  const startTime = new Date(hall?.start_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const date = new Date(hall?.start_time).toLocaleDateString();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Загрузка информации о сеансе...
      </div>
    );
  }

  if (!hall) {
    return (
      <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>
        Ошибка: сеанс не найден.
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '40px 20px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Заголовок */}
      <h1 style={{ color: '#e50914', textAlign: 'center', marginBottom: '20px' }}>
        Выбор мест
      </h1>

      {/* Информация о сеансе */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          {hall.title}
        </h2>
        <p><strong>Дата:</strong> {date}</p>
        <p><strong>Время:</strong> {startTime}</p>
        <p><strong>Зал:</strong> {hall.hall_name}</p>
      </div>

      {/* Схема зала с рядами */}
      {hall.row_count && hall.seats_per_row ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          {Array.from({ length: hall.row_count }, (_, i) => {
            const rowNum = i + 1;
            return (
              <div key={rowNum} style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {Array.from({ length: hall.seats_per_row }, (_, j) => {
                  const seatNum = (rowNum - 1) * hall.seats_per_row + (j + 1);
                  const isOccupied = occupiedSeats.includes(seatNum);
                  const isSelected = selectedSeats.includes(seatNum);
                  return (
                    <button
                      key={seatNum}
                      onClick={() => handleSeatClick(seatNum)}
                      disabled={isOccupied}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: isOccupied ? '#ccc' : isSelected ? '#e50914' : '#fff',
                        color: isOccupied ? '#999' : isSelected ? 'white' : '#000',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: isOccupied ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Данные о количестве рядов недоступны.</p>
      )}

      {/* Подпись под схемой */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px'
      }}>
        <span style={{ marginRight: '15px' }}>🟩 — доступно</span>
        <span style={{ marginRight: '15px' }}>🔴 — выбрано</span>
        <span>⚫ — занято</span>
      </div>

      {/* Итоговая цена */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        <p>К оплате: <span style={{ color: '#e50914' }}>{totalPrice} ₽</span></p>
      </div>

      {/* Кнопки навигации */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '120px'
          }}
        >
           На главную
        </button>

        <button
          onClick={() => window.location.href = '/my-tickets'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '120px'
          }}
        >
           Личный кабинет
        </button>

        <button
          onClick={() => {
            if (selectedSeats.length === 0) {
              alert('Выберите хотя бы одно место');
              return;
            }
            alert(`Билеты на ${selectedSeats.length} мест успешно куплены!`);
            window.location.href = '/my-tickets';
          }}
          disabled={selectedSeats.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedSeats.length > 0 ? '#e50914' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            minWidth: '120px'
          }}
        >
           Купить билеты
        </button>
      </div>
    </div>
  );
}