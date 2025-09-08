// backend/routes/tickets.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * POST /api/tickets/sell
 * Продажа билета
 */
router.post('/sell', async (req, res) => {
  const { screening_id, seat_id, user_id } = req.body;

  try {
    // Проверка: сеанс существует?
    const [screening] = await sequelize.query(`
      SELECT s.screening_id, s.capacity, s.base_price
      FROM screenings s
      WHERE s.screening_id = ?
      AND s.is_active = TRUE
    `, { replacements: [screening_id] });

    if (!screening.length) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    // Проверка: место свободно?
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
    `, { replacements: [screening_id, seat_id, user_id, screening[0].base_price] });

    const ticketId = result[0].insertId;

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

module.exports = router;