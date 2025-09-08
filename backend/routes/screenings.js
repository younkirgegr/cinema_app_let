// routes/screenings.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * GET /api/screenings/today
 * Возвращает сеансы на текущий день
 */
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // '2025-04-05'

  try {
    const [results] = await sequelize.query(`
      SELECT 
        s.screening_id,
        s.start_time,
        s.end_time,
        s.base_price,
        f.film_id,
        f.title,
        f.duration_min,
        f.rating,
        h.hall_id,
        h.hall_name,
        ht.type_name AS hall_type
      FROM screenings s
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      JOIN hall_types ht ON h.type_id = ht.type_id
      WHERE DATE(s.start_time) = ?
      AND s.is_active = TRUE
      ORDER BY s.start_time
    `, { replacements: [today] });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});

module.exports = router;