// routes/screenings.js
const express = require('express');
const router = express.Router();
const  sequelize  = require('../config/database');

router.get('/film/:filmId', async (req, res) => {
  const { filmId } = req.params;

  try {
    // 🔁 Упрощённый запрос — без JOIN и условий
    const [screenings] = await sequelize.query(`
      SELECT 
        s.screening_id,
        s.start_time,
        s.base_price,
        s.hall_id
      FROM screenings s
      WHERE s.film_id = ?
      ORDER BY s.start_time
    `, { replacements: [filmId] });

    console.log('Найдено сеансов:', screenings.length); // 🔍 Лог в терминал
    res.json(screenings);
  } catch (err) {
    console.error('❌ Ошибка в /film/:filmId:', err); // 🔍 Вот сюда смотри!
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});

module.exports = router;
