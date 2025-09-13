import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyTicketsPage() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Загружаем данные пользователя и билеты
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Разделяем токен на userId и role_id
      const [userId, role_id] = token.split('.');
      if (!userId || !role_id) {
        throw new Error('Неверный формат токена');
      }

      setUser({
        userId: parseInt(userId),
        role_id: parseInt(role_id)
      });
    } catch (e) {
      console.error('Ошибка декодирования токена:', e);
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Загружаем билеты
    fetch('http://localhost:5000/api/my-tickets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          setError('Не удалось загрузить билеты.');
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки билетов:', err);
        setError('Ошибка подключения к серверу.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Обработчики кнопок
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    alert('Вы успешно вышли из аккаунта');
  };

  const handleEditProfile = () => {
    alert('Функция редактирования профиля скоро будет доступна!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      localStorage.removeItem('token');
      alert('Аккаунт удалён');
      navigate('/');
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Шапка */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e50914'
      }}>
        <h1 style={{ color: '#e50914', margin: 0 }}>
          Личный кабинет
        </h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← На главную
        </button>
      </header>

      {/* Информация о пользователе */}
      {user && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>
            Привет, {user.userId}
          </h2>
          <p><strong>Роль:</strong> {user.role_id === 1 ? 'Посетитель' : user.role_id === 2 ? 'Кассир' : 'Администратор'}</p>
        </div>
      )}

      {/* Кнопки управления */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '40px',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleEditProfile}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '150px'
          }}
        >
          ✏️ Редактировать профиль
        </button>

        <button
          onClick={handleDeleteAccount}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '150px'
          }}
        >
          🗑 Удалить аккаунт
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '150px'
          }}
        >
          🔐 Выйти из аккаунта
        </button>
      </div>

      {/* Заголовок */}
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>
        Мои билеты
      </h2>

      {/* Ошибка */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Загрузка */}
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Загрузка билетов...</p>
      ) : tickets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
          У вас пока нет купленных билетов.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {tickets.map(ticket => (
            <div key={ticket.ticket_id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}>
              <img
                src={ticket.poster_url || '/posters/default.jpg'}
                alt={ticket.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  {ticket.title}
                </h3>
                <p><strong>Дата:</strong> {new Date(ticket.start_time).toLocaleDateString()}</p>
                <p><strong>Время:</strong> {new Date(ticket.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Зал:</strong> {ticket.hall_name}</p>
                <p><strong>Место:</strong> Ряд {ticket.row_num}, Место {ticket.seat_num}</p>
                <p style={{ fontWeight: 'bold', color: '#e50914' }}>
                  Цена: {ticket.price} ₽
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Футер */}
      <footer style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
        paddingTop: '20px'
      }}>
        &copy; 2025 КиноМир. Все права защищены.
      </footer>
    </div>
  );
}