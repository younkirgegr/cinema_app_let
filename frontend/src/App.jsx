import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './AppContent';
import SelectSeatsPage from './pages/SelectSeatsPage';
import SoonInCinemaPage from './pages/SoonInCinemaPage';
import MyTicketsPage from './pages/MyTicketsPage';
import SchedulePage from './pages/SchedulePage'; 
//import LoginForm from './components/auth/LoginForm';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tickets/:screeningId" element={<SelectSeatsPage />} />
        <Route path="/soon" element={<SoonInCinemaPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/schedule" element={<SchedulePage />} /> 
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}