// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const [userJustLoggedIn, setUserJustLoggedIn] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log("LoginPage: handleLoginSuccess вызван с данными:", userData);
    setUserJustLoggedIn(true);
  };

  useEffect(() => {
     if (userJustLoggedIn) {
        const timer = setTimeout(() => {
           console.log(" LoginPage: Перенаправление на главную...");
           navigate('/'); // Перенаправляем на главную страницу
        }, 100);
        return () => clearTimeout(timer);
     }
  }, [userJustLoggedIn, navigate]);

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Вход в КиноМир</h1>
      <LoginForm onLogin={handleLoginSuccess} />
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '8px 16px', width: '100%' }}
      >
        ← Назад на главную
      </button>
    </div>
  );
}