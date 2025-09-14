// src/components/auth/LoginForm.jsx

import { useState } from 'react';
import { login } from '../../services/api'; // Убедитесь, что путь правильный


export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log(' LoginForm: Отправка данных для входа...');
      // 1. Вызываем функцию API для входа
      const data = await login(email, password);
      console.log('📥 LoginForm: Получен ответ от API:', data);

      // 2. Проверяем, что ответ существует и является объектом
      if (!data || typeof data !== 'object') {
        throw new Error('Неверный формат ответа от сервера.');
      }

      // 3. Проверяем, есть ли в ответе ошибка от сервера (например, 401)
      if (data.error) {
        // Если сервер прислал объект с полем `error`, показываем его
        throw new Error(data.error);
      }

      // 4. Проверяем, есть ли токен в ответе
      if (!data.user.token){
        console.error(' LoginForm: Ответ от API не содержит token:', data);
        throw new Error('Ответ сервера не содержит токен. Обратитесь к администратору.');
      }

      // 5. Если токен есть, сохраняем его в localStorage
      console.log('LoginForm: Сохранение токена в localStorage...');
      localStorage.setItem('token', data.user.token);
      console.log('LoginForm: Токен успешно сохранён.');

      // 6. Вызываем функцию onLogin, переданную из AppContent, 
      //    чтобы обновить состояние пользователя в основном приложении.
      //    Передаём данные пользователя из ответа или заглушку.
      const userData = data.user || { first_name: "Пользователь" };
      console.log('LoginForm: Вызов onLogin с данными пользователя:', userData);
      onLogin(userData);

    } catch (err) {
      // 7. Обрабатываем любые ошибки (сетевые, от сервера, логические)
      console.error('LoginForm: Ошибка при входе:', err);
      // Отображаем пользователю понятное сообщение
      setError(err.message || 'Ошибка подключения к серверу. Попробуйте позже.');
    } finally {
      // 8. В любом случае, завершаем состояние загрузки
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Вход</h2>
      
      {/* Отображение ошибки, если она есть */}
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Поле Email */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="login-email" style={{ display: 'block', marginBottom: '5px' }}>
          Email:
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@kino.ru"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Поле Пароль */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="login-password" style={{ display: 'block', marginBottom: '5px' }}>
          Пароль:
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="user123"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        disabled={isLoading} // Блокируем кнопку во время загрузки
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isLoading ? '#cccccc' : '#e50914', // Серый, если загружается
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer', // Меняем курсор
          fontWeight: 'bold'
        }}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}