// routes/reviews.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const auth = require('../middleware/auth');

/**
 * POST /api/reviews
 * Добавить отзыв на фильм
 */
router.post('/', auth, async (req, res) => {
  const { film_id, rating, comment } = req.body;
  const user_id = req.user.user_id;

  // Проверка: переданы ли данные
  if (!film_id || !rating) {
    return res.status(400).json({ error: 'Требуются film_id и rating' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
  }

  try {
    // Проверка: пользователь уже оценивал фильм?
    const [existing] = await sequelize.query(
      'SELECT * FROM reviews WHERE film_id = ? AND user_id = ?',
      { replacements: [film_id, user_id] }
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Вы уже оставляли отзыв на этот фильм' });
    }

    // Добавляем отзыв
    await sequelize.query(
      'INSERT INTO reviews (film_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      { replacements: [film_id, user_id, rating, comment || null] }
    );

    res.status(201).json({ message: 'Отзыв успешно добавлен' });
  } catch (err) {
    console.error('❌ Ошибка при добавлении отзыва:', err);
    res.status(500).json({ error: 'Не удалось добавить отзыв' });
  }
});

/**
 * GET /api/reviews?film_id=1
 * Получить все отзывы к фильму
 */
router.get('/', async (req, res) => {
  const { film_id } = req.query;
  let query = `
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      u.user_id,
      u.first_name,
      u.last_name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
  `;
  const replacements = [];

  if (film_id) {
    query += ' WHERE r.film_id = ?';
    replacements.push(film_id);
  }

  query += ' ORDER BY r.created_at DESC';

  try {
    const [results] = await sequelize.query(query, { replacements });
    res.json(results);
  } catch (err) {
    console.error('❌ Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении отзывов' });
  }
});

module.exports = router;