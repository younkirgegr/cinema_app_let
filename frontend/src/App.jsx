// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './AppContent';
import SoonInCinemaPage from './pages/SoonInCinemaPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница — афиша */}
        <Route path="/" element={<AppContent />} />

        {/* Страница "Скоро в кино" */}
        <Route path="/soon" element={<SoonInCinemaPage />} />
      </Routes>
    </Router>
  );
}