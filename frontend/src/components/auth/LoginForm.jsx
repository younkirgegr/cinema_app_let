// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { login } from '../../services/api';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      onLogin(res.user);
    } catch (err) {
      setError(err.error || 'Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '300px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Вход</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      
      <button type="submit" style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }}>
        Войти
      </button>
    </form>
  );
}