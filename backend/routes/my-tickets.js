const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const sequelize = require('../config/database');

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [tickets] = await sequelize.query(`
      SELECT 
        t.ticket_id,
        t.seat_id AS seat_num,
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
    `, { replacements: [userId] });

    res.json(tickets);
  } catch (err) {
    console.error('Ошибка при получении билетов:', err);
    res.status(500).json({ error: 'Не удалось загрузить билеты.' });
  }
});

module.exports = router;