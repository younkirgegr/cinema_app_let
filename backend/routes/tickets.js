// routes/tickets.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const checkRole = require('../middleware/role');

router.post('/sell', checkRole(['Кассир']), async (req, res) => {
  const { screening_id, seat_id, user_id } = req.body;

  try {
    // Проверка: существует ли сеанс?
    const [screenings] = await sequelize.query(
      'SELECT * FROM screenings WHERE screening_id = ? AND is_active = TRUE',
      { replacements: [screening_id] }
    );

    if (screenings.length === 0) {
      return res.status(400).json({ error: 'Сеанс не найден или отменён' });
    }

    // Проверка: существует ли место?
    const [seats] = await sequelize.query(
      'SELECT * FROM seats WHERE seat_id = ?',
      { replacements: [seat_id] }
    );

    if (seats.length === 0) {
      return res.status(400).json({ error: 'Место не найдено' });
    }

    // Проверка: занято ли место?
    const [takenTickets] = await sequelize.query(
      'SELECT COUNT(*) AS count FROM tickets WHERE screening_id = ? AND seat_id = ? AND status = "active"',
      { replacements: [screening_id, seat_id] }
    );

    if (takenTickets[0].count > 0) {
      return res.status(400).json({ error: 'Место уже занято' });
    }

    // Получаем цену сеанса
    const price = screenings[0].base_price;

    // Создаём билет
    const [result] = await sequelize.query(
      'INSERT INTO tickets (screening_id, seat_id, user_id, cashier_id, price) VALUES (?, ?, ?, ?, ?)',
      { replacements: [screening_id, seat_id, user_id, req.user.user_id, price] }
    );

    const ticketId = result.insertId;

    // 📝 Логируем продажу
    await sequelize.query(
      'INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
      { replacements: ['sell_ticket', req.user.user_id, `Продан билет на сеанс ${screening_id}`] }
    );

    res.json({
      ticket_id: ticketId,
      message: 'Билет продан'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;