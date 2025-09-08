// src/pages/TicketsPage.jsx
import HallScheme from '../components/tickets/HallScheme';

export default function TicketsPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎟️ Выберите место</h1>
      <HallScheme />
    </div>
  );
}