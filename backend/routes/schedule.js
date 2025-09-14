const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  const { day } = req.query;

  try {
    // Определяем дату
    const targetDate = new Date();
    if (day === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    // Форматируем дату как YYYY-MM-DD
    const dateString = targetDate.toISOString().split('T')[0];
    console.log(`[Schedule] Запрошены сеансы на ${dateString} (${day || 'today'})`);

    const [results] = await sequelize.query(`
        SELECT 
            f.film_id,
            f.title,
            g.genre_name,  
            f.duration_min,
            COALESCE(AVG(r.rating), 0.0) as avg_rating,  
            f.poster_url,
            f.description,
            s.screening_id,
            s.start_time,
            s.base_price,
            h.hall_name
        FROM films f
        JOIN screenings s ON f.film_id = s.film_id
        JOIN halls h ON s.hall_id = h.hall_id
        JOIN genres g ON f.genre_id = g.genre_id  
        LEFT JOIN reviews r ON f.film_id = r.film_id  
        WHERE s.is_active = TRUE
            AND DATE(s.start_time) = ?
        GROUP BY f.film_id, f.title, f.duration_min, f.poster_url, f.description, s.screening_id, s.start_time, s.base_price, h.hall_name, g.genre_name
        ORDER BY s.start_time ASC
    `, { replacements: [dateString] });

    // Группируем результаты по фильмам
    const groupedFilms = {};
    results.forEach(row => {
      if (!groupedFilms[row.film_id]) {
        groupedFilms[row.film_id] = {
          film_id: row.film_id,
          title: row.title,
          genre_name: row.genre_name,
          duration_min: row.duration_min,
          avg_rating: row.avg_rating,
          poster_url: row.poster_url,
          description: row.description,
          screenings: []
        };
      }
      groupedFilms[row.film_id].screenings.push({
        screening_id: row.screening_id,
        start_time: row.start_time,
        base_price: row.base_price,
        hall_name: row.hall_name
      });
    });

    // Преобразуем объект в массив
    const scheduleList = Object.values(groupedFilms);
    console.log(`[Schedule] Найдено ${scheduleList.length} фильмов со сеансами`);
    res.json(scheduleList);

  } catch (err) {
    console.error('[Schedule] Ошибка при получении расписания:', err);
    res.status(500).json({ error: 'Ошибка при получении расписания' });
  }
});

module.exports = router;