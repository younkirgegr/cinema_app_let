// src/components/tickets/HallScheme.jsx
import { useState, useEffect } from 'react';
import { getScreeningsToday, sellTicket, getOccupiedSeats } from '../../services/api';

export default function HallScheme() {
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // Загружаем сеансы
  useEffect(() => {
    getScreeningsToday().then(data => {
      setScreenings(data);
    });
  }, []);

  // Загружаем занятые места при выборе сеанса
  useEffect(() => {
    if (selectedScreening) {
      getOccupiedSeats(selectedScreening.screening_id)
        .then(seats => setOccupiedSeats(seats))
        .catch(err => {
          console.error('Ошибка загрузки занятых мест:', err);
          setOccupiedSeats([]);
        });
    } else {
      setOccupiedSeats([]);
    }
  }, [selectedScreening]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) {
      alert('Место уже занято!');
      return;
    }
    setSelectedSeat(seatId);
  };

  const handleBuy = () => {
    if (!selectedSeat || !selectedScreening) return;

    setLoading(true);
    sellTicket({
      screening_id: selectedScreening.screening_id,
      seat_id: selectedSeat,
      user_id: 1
    })
    .then(() => {
      alert('✅ Билет успешно куплен!');
      // Обновляем список занятых мест
      setOccupiedSeats(prev => [...prev, selectedSeat]);
      setSelectedSeat(null);
    })
    .catch(err => {
      alert(err.error || 'Ошибка при покупке');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <h3>Выберите сеанс</h3>
      <select 
        value={selectedScreening ? selectedScreening.screening_id : ''}
        onChange={(e) => {
          const screening = screenings.find(s => s.screening_id == e.target.value);
          setSelectedScreening(screening);
          setSelectedSeat(null);
        }}
        style={{
          padding: '10px',
          width: '300px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      >
        <option value="">Выберите сеанс</option>
        {screenings.map(s => (
          <option key={s.screening_id} value={s.screening_id}>
            {s.title} — {s.start_time} ({s.hall_name}, {s.base_price}₽)
          </option>
        ))}
      </select>

      {selectedScreening && (
        <div>
          <h4>Зал: {selectedScreening.hall_name}</h4>
          <p>Ряды: 1–10, Места: 1–15</p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: 'fit-content',
            margin: '20px 0'
          }}>
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row + 1} style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: 15 }, (_, col) => {
                  const seatId = row * 15 + col + 1;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeat === seatId;

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isOccupied}
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: isOccupied 
                          ? '#ccc' 
                          : isSelected 
                            ? '#28a745' 
                            : '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: isOccupied ? 0.6 : 1
                      }}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <button
            onClick={handleBuy}
            disabled={!selectedSeat || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Обработка...' : `Купить за ${selectedScreening.base_price}₽`}
          </button>
        </div>
      )}
    </div>
  );
}