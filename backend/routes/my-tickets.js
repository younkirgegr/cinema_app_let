// routes/my-tickets.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const auth = require('../middleware/auth');

/**
 * GET /api/tickets/my
 * Возвращает историю покупок текущего пользователя
 */
router.get('/my', auth, async (req, res) => {
  try {
    const [tickets] = await sequelize.query(`
      SELECT 
        t.ticket_id,
        t.sale_time,
        t.price,
        t.status,
        f.film_id,
        f.title,
        f.rating,
        s.start_time,
        s.end_time,
        h.hall_name,
        ht.type_name AS hall_type,
        se.row_num,
        se.seat_num,
        se.seat_type
      FROM tickets t
      JOIN screenings s ON t.screening_id = s.screening_id
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      JOIN hall_types ht ON h.type_id = ht.type_id
      JOIN seats se ON t.seat_id = se.seat_id
      WHERE t.user_id = ?
      ORDER BY s.start_time DESC
    `, { replacements: [req.user.user_id] });

    res.json(tickets);
  } catch (err) {
    console.error('❌ Ошибка при получении билетов:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении истории покупок' });
  }
});

module.exports = router;