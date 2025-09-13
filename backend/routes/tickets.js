const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/auth');


router.post('/sell', authMiddleware, async (req, res) => {
  const { screening_id, seat_id, user_id } = req.body;

  try {
    // Проверка: сеанс существует
    const [screening] = await sequelize.query(`
      SELECT s.screening_id, s.capacity, s.base_price
      FROM screenings s
      WHERE s.screening_id = ?
      AND s.is_active = TRUE
    `, { replacements: [screening_id] });

    if (!screening.length) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    if (!screening[0].base_price) {
      return res.status(400).json({ error: 'Цена сеанса не указана' });
    }

    // Проверка: место свободно
    const [takenSeats] = await sequelize.query(`
      SELECT seat_id
      FROM tickets t
      WHERE t.screening_id = ?
      AND t.seat_id = ?
    `, { replacements: [screening_id, seat_id] });

    if (takenSeats.length > 0) {
      return res.status(400).json({ error: 'Место уже занято' });
    }

    // Создание билета
    const [result] = await sequelize.query(`
      INSERT INTO tickets (screening_id, seat_id, user_id, price)
      VALUES (?, ?, ?, ?)
    `, { 
      replacements: [screening_id, seat_id, user_id, screening[0].base_price],
      type: sequelize.QueryTypes.INSERT 
    });

    // Получаем ID вставленной записи
    const ticketId = result; 

    res.json({
      ticket_id: ticketId,
      screening_id,
      seat_id,
      user_id,
      price: screening[0].base_price
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при продаже билета' });
  }
});


router.get('/my', authMiddleware, async (req, res) => {
  // Убедимся, что req.user существует
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Неавторизованный пользователь' });
  }

  const userId = req.user.userId;

  try {
    console.log('Получение билетов для user_id:', userId);

    // SQL-запрос: получаем билеты с информацией о фильме, зале и времени
    const [tickets] = await sequelize.query(`
      SELECT
        t.ticket_id,
        t.row_num,
        t.seat_num,
        t.price,
        f.title,
        f.poster_url,
        h.hall_name,
        s.start_time
      FROM tickets t
      JOIN screenings s ON t.screening_id = s.screening_id
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE t.user_id = ?
      ORDER BY s.start_time DESC
    `, {
      replacements: [userId]
    });

    console.log(`Найдено билетов: ${tickets.length}`);

    // Отправляем билеты клиенту
    res.json(tickets);
  } catch (err) {
    console.error('Ошибка при получении билетов:', err);
    res.status(500).json({
      error: 'Не удалось загрузить ваши билеты. Попробуйте позже.'
    });
  }
});

router.get('/occupied/:screening_id', async (req, res) => {
  const { screening_id } = req.params;

  try {
    const [occupiedSeats] = await sequelize.query(`
      SELECT seat_id
      FROM tickets
      WHERE screening_id = ?
    `, { replacements: [screening_id] });

    // Возвращаем только seat_id
    res.json(occupiedSeats.map(s => s.seat_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении занятых мест' });
  }
});

module.exports = router;