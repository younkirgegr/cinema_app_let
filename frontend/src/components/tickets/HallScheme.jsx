// src/components/tickets/HallScheme.jsx
import { useState, useEffect } from 'react';
import { getScreeningsToday, sellTicket } from '../../services/api';

export default function HallScheme() {
  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getScreeningsToday().then(data => {
      setScreenings(data);
    });
  }, []);

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId);
  };

  const handleBuy = () => {
    if (!selectedSeat || !selectedScreening) return;

    setLoading(true);
    sellTicket({
      screening_id: selectedScreening.screening_id,
      seat_id: selectedSeat,
      user_id: 1
    }).then(() => {
      alert('Билет куплен!');
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <select onChange={(e) => {
        const screening = screenings.find(s => s.screening_id == e.target.value);
        setSelectedScreening(screening);
      }}>
        <option>Выберите сеанс</option>
        {screenings.map(s => (
          <option key={s.screening_id} value={s.screening_id}>
            {s.title} — {s.start_time}
          </option>
        ))}
      </select>

      {selectedScreening && (
        <div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', width: '300px' }}>
            {Array.from({ length: 150 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleSeatClick(i + 1)}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: selectedSeat === i + 1 ? 'green' : 'white',
                  border: '1px solid #ddd'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={handleBuy} disabled={!selectedSeat}>
            Купить билет
          </button>
        </div>
      )}
    </div>
  );
}