// src/pages/MyTicketsPage.jsx
import { useState, useEffect } from 'react';
import { getMyTickets } from '../services/api';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTickets()
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки билетов:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка билетов...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎟️ Мои билеты</h1>
      {tickets.length === 0 ? (
        <p>У вас пока нет купленных билетов</p>
      ) : (
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {tickets.map(ticket => (
            <div key={ticket.ticket_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              width: '300px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>{ticket.title}</h3>
              <p><strong>Зал:</strong> {ticket.hall_name}</p>
              <p><strong>Время:</strong> {ticket.start_time}</p>
              <p><strong>Место:</strong> {ticket.seat_id}</p>
              <p><strong>Цена:</strong> {ticket.price}₽</p>
              <p><strong>Дата покупки:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}