// backend/routes/tickets.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Маршрут для получения сеансов по ID фильма
router.get('/film/:filmId', async (req, res) => {
  // Проверка: является ли req определённым
  if (!req) {
    return res.status(400).json({ error: 'Запрос не определён' });
  }

  const { filmId } = req.params;

  // Проверка: является ли filmId числом
  if (!Number.isInteger(Number(filmId))) {
    return res.status(400).json({ error: 'ID фильма должен быть целым числом' });
  }

  try {
    const [screenings] = await sequelize.query(`
      SELECT 
        s.screening_id,
        s.start_time,
        s.base_price,
        s.hall_id
      FROM screenings s
      WHERE s.film_id = ?
        AND s.is_active = TRUE
      ORDER BY s.start_time
    `, { replacements: [filmId] });

    if (screenings.length === 0) {
      return res.status(404).json({ error: 'Сеансы для этого фильма не найдены' });
    }

    res.json(screenings);
  } catch (err) {
    console.error('Ошибка в /film/:filmId:', err);
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});

// ВОССТАНОВЛЕННЫЙ МАРШРУТ: для получения деталей конкретного сеанса
router.get('/details/:screeningId', async (req, res) => {
  const { screeningId } = req.params;

  try {
    const [data] = await sequelize.query(`
      SELECT 
        f.title,
        s.start_time,
        s.base_price,
        h.hall_name,
        h.row_count,
        h.seats_per_row
      FROM screenings s
      JOIN films f ON s.film_id = f.film_id
      JOIN genres g ON f.genre_id = g.genre_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.screening_id = ?
        AND s.is_active = TRUE
    `, { replacements: [screeningId] });

    if (data.length === 0) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Ошибка при получении данных о сеансе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ВОССТАНОВЛЕННЫЙ МАРШРУТ: для получения занятых мест
router.get('/occupied/:screening_id', async (req, res) => {
  const { screening_id } = req.params;

  try {
    // Проверяем, существует ли сеанс
    const [screening] = await sequelize.query(`
      SELECT screening_id FROM screenings WHERE screening_id = ? AND is_active = TRUE
    `, { replacements: [screening_id] });

    if (screening.length === 0) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    // Получаем все занятые места для этого сеанса
    const [occupiedSeats] = await sequelize.query(`
      SELECT seat_id 
      FROM tickets 
      WHERE screening_id = ?
    `, { replacements: [screening_id] });

    // Возвращаем только массив ID мест
    const seatIds = occupiedSeats.map(s => s.seat_id);

    res.json(seatIds);
  } catch (err) {
    console.error('Ошибка при получении занятых мест:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке занятых мест' });
  }
});

// Маршрут для получения фильмов с их сеансами на сегодня или завтра
router.get('/with-screenings', async (req, res) => {
  const { day } = req.query;

  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dateFilter = day === 'today' ? today : day === 'tomorrow' ? tomorrow : null;

    if (!dateFilter) {
      return res.json([]);
    }

    const [films] = await sequelize.query(`
      SELECT 
        f.film_id,
        f.title,
        g.genre_name,
        f.duration_min,
        f.rating AS avg_rating,
        f.poster_url,
        f.description,
        s.screening_id,
        s.start_time,
        s.base_price,
        h.hall_name
      FROM films f
      JOIN genres g ON f.genre_id = g.genre_id
      JOIN screenings s ON f.film_id = s.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.is_active = TRUE
        AND DATE(s.start_time) = ?
      ORDER BY f.title, s.start_time
    `, { replacements: [dateFilter] });

    // Группируем по фильму
    const grouped = {};
    films.forEach(row => {
      if (!grouped[row.film_id]) {
        grouped[row.film_id] = {
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
      grouped[row.film_id].screenings.push({
        screening_id: row.screening_id,
        start_time: row.start_time,
        base_price: row.base_price,
        hall_name: row.hall_name
      });
    });

    const result = Object.values(grouped);
    console.log(`[Films/with-screenings] Найдено ${result.length} фильмов со сеансами`);
    res.json(result);
  } catch (err) {
    console.error('[Films/with-screenings] Ошибка:', err);
    res.status(500).json({ error: 'Ошибка при получении расписания' });
  }
});

module.exports = router;