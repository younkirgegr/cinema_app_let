import { useState, useEffect } from 'react';
import { getMyTickets } from '../services/api';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyTickets()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTickets(data);
        } else {
          setError('У вас пока нет купленных билетов');
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки билетов:', err);
        setError('Не удалось загрузить билеты. Проверьте подключение или войдите снова.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          На главную
        </button>
      </header>

      {/* Заголовок */}
      <h2 style={{ marginBottom: '20px' }}> Мои билеты</h2>

      {/* Загрузка */}
      {loading && <p>Загрузка билетов...</p>}

      {/* Ошибка */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Билеты */}
      {!loading && !error && tickets.length === 0 && (
        <p>У вас пока нет купленных билетов</p>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {tickets.map(ticket => (
          <div key={ticket.ticket_id} style={{
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img
              src={ticket.poster_url || `/posters/${ticket.film_id}.jpg`}
              alt={ticket.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '16px' }}>
              <h3>{ticket.title}</h3>
              <p><strong>Жанр:</strong> {ticket.genre_name}</p>
              <p><strong>Время:</strong> {ticket.start_time}</p>
              <p><strong>Зал:</strong> {ticket.hall_name}</p>
              <p><strong>Место:</strong> Ряд {ticket.row_num}, Место {ticket.seat_num}</p>
              <p><strong>Цена:</strong> {ticket.price} ₽</p>
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
      </footer>
    </div>
  );
}
