// routes/screenings.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * GET /api/screenings/today
 * Возвращает сеансы на текущий день
 */
// backend/routes/screenings.js
router.get('/film/:filmId', async (req, res) => {
  const { filmId } = req.params;

  try {
    const [screenings] = await sequelize.query(`
      SELECT 
        s.screening_id,
        s.start_time,
        s.end_time,
        s.base_price,
        h.hall_name,
        s.is_vip
      FROM screenings s
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.film_id = ? 
        AND s.start_time >= NOW()
        AND s.start_time < DATE_ADD(NOW(), INTERVAL 2 DAY)
      ORDER BY s.start_time
    `, { replacements: [filmId] });

    res.json(screenings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});

// backend/routes/screenings.js
router.get('/film/:filmId', async (req, res) => {
  const { filmId } = req.params;

  try {
    const [screenings] = await sequelize.query(`
      SELECT s.screening_id, s.start_time, h.hall_name, s.base_price
      FROM screenings s
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.film_id = ? AND s.start_time >= NOW()
      ORDER BY s.start_time
    `, { replacements: [filmId] });

    res.json(screenings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});

module.exports = router;