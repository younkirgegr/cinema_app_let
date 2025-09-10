// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './AppContent';
import SoonInCinemaPage from './pages/SoonInCinemaPage';
import MyTicketsPage from './pages/MyTicketsPage';
import SchedulePage from './pages/SchedulePage'; // ✅ Добавь импорт

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/soon" element={<SoonInCinemaPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/schedule" element={<SchedulePage />} /> {/* ✅ Добавь маршрут */}
      </Routes>
    </Router>
  );
}