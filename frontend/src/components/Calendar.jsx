// src/components/Calendar.jsx
import { useState } from 'react';

export default function Calendar({ onClose, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelectDate(date);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const daysArray = [];

    // Добавляем пустые ячейки для дней до начала месяца
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} style={{ width: '40px' }}></div>);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === new Date().getDate() && 
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();
      
      daysArray.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isSelected ? '#007bff' : 'transparent',
            color: isSelected ? 'white' : '#333',
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          {day}
        </button>
      );
    }

    return daysArray;
  };

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '360px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Выбрать день</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handlePrevMonth}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ◀
        </button>
        <select
          value={currentDate.getFullYear()}
          onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth()))}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '80px'
          }}
        >
          {[...Array(10)].map((_, i) => {
            const year = 2024 - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
        <select
          value={currentDate.getMonth()}
          onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), e.target.value))}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '120px'
          }}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
        <button
          onClick={handleNextMonth}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ▶
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '10px' }}>
        {days.map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {renderDays()}
      </div>
    </div>
  );
}