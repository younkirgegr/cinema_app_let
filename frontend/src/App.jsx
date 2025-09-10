// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './AppContent';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}