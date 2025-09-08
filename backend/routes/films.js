// routes/films.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * GET /api/films?search=мстители&genre=4&rating=12+
 * Возвращает фильмы с фильтрами и поиском
 */
router.get('/', async (req, res) => {
  const { search, genre, rating } = req.query;
  let query = `
    SELECT 
      f.film_id,
      f.title,
      f.genre_id,
      g.genre_name,
      f.duration_min,
      f.rating,
      f.description,
      f.release_date,
      f.poster_url,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.review_id) as reviews_count
    FROM films f
    JOIN genres g ON f.genre_id = g.genre_id
    LEFT JOIN reviews r ON f.film_id = r.film_id
    WHERE 1=1
  `;
  const replacements = [];

  // Фильтр: поиск по названию
  if (search) {
    query += ' AND f.title LIKE ?';
    replacements.push(`%${search}%`);
  }

  // Фильтр: по жанру
  if (genre) {
    query += ' AND f.genre_id = ?';
    replacements.push(genre);
  }

  // Фильтр: по возрастному рейтингу
  if (rating) {
    query += ' AND f.rating = ?';
    replacements.push(rating);
  }

  // Группировка для агрегации отзывов
  query += ' GROUP BY f.film_id';

  // Сортировка: новые фильмы и с высоким рейтингом — выше
  query += ' ORDER BY f.release_date DESC, avg_rating DESC';

  try {
    const [results] = await sequelize.query(query, { replacements });
    res.json(results);
  } catch (err) {
    console.error('❌ Ошибка при получении фильмов:', err);
    res.status(500).json({ error: 'Не удалось загрузить фильмы' });
  }
});

module.exports = router;