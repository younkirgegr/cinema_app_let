// backend/routes/films.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * GET /api/films
 * Возвращает фильмы с фильтрацией по жанру и поиску
 */
router.get('/', async (req, res) => {
  const { search, genre } = req.query;

  let query = `
    SELECT 
      f.film_id,
      f.title,
      f.duration_min,
      f.rating,
      g.genre_name,
      AVG(r.rating) as avg_rating
    FROM films f
    JOIN genres g ON f.genre_id = g.genre_id
    LEFT JOIN reviews r ON f.film_id = r.film_id
    WHERE 1=1
  `;

  const replacements = [];

  if (search) {
    query += ` AND f.title LIKE ?`;
    replacements.push(`%${search}%`);
  }

  if (genre) {
    query += ` AND f.genre_id = ?`;
    replacements.push(genre);
  }

  query += ` GROUP BY f.film_id, f.title, f.duration_min, f.rating, g.genre_name`;

  try {
    const [films] = await sequelize.query(query, { replacements });
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении фильмов' });
  }
});

/**
 * POST /api/films
 * Добавление нового фильма (только для администратора)
 */
router.post('/', async (req, res) => {
  const { title, genre_id, duration_min, rating } = req.body;

  // Проверка авторизации
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    // Проверка роли: только администратор (role_id = 3)
    if (payload.role_id !== 3) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    // Проверка данных
    if (!title || !genre_id || !duration_min || !rating) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ error: 'Рейтинг должен быть от 0 до 10' });
    }

    // Добавление фильма
    const [result] = await sequelize.query(`
      INSERT INTO films (title, genre_id, duration_min, rating)
      VALUES (?, ?, ?, ?)
    `, {
      replacements: [title, genre_id, duration_min, rating]
    });

    const filmId = result.insertId || result[0];

    res.status(201).json({
      film_id: filmId,
      title,
      genre_id,
      duration_min,
      rating,
      avg_rating: rating // Пока отзывов нет
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении фильма' });
  }
});

// backend/routes/films.js
router.get('/:filmId', async (req, res) => {
  const { filmId } = req.params;

  try {
    const [films] = await sequelize.query(`
      SELECT f.*, g.genre_name
      FROM films f
      JOIN genres g ON f.genre_id = g.genre_id
      WHERE f.film_id = ?
    `, { replacements: [filmId] });

    if (films.length === 0) {
      return res.status(404).json({ error: 'Фильм не найден' });
    }

    res.json(films[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении фильма' });
  }
});

module.exports = router;