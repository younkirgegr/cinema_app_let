const express = require('express');
const router = express.Router();

// Подключаем мидлваре авторизации
const authMiddleware = require('../middleware/auth');

// Подключаем sequelize для работы с базой
const { sequelize } = require('../config/database');

router.get('/', authMiddleware, async (req, res) => {
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
        f.genre_name,
        h.hall_name,
        s.start_time
      FROM tickets t
      JOIN screenings s ON t.screening_id = s.screening_id
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE t.user_id = ?
      ORDER BY s.start_time DESC
    `, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    });

    console.log('Найдено билетов:', tickets.length);
    res.json(tickets);
  } catch (err) {
    console.error('Ошибка при получении билетов:', err);
    res.status(500).json({
      error: 'Не удалось загрузить ваши билеты. Попробуйте позже.'
    });
  }
});

module.exports = router;