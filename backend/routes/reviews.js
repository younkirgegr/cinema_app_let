const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [reviews] = await sequelize.query(`
      SELECT r.review_id, r.text, r.rating, u.first_name, u.last_name, f.title
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN films f ON r.film_id = f.film_id
      ORDER BY r.created_at DESC
    `);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
});

router.post('/', async (req, res) => {
  const { film_id, rating, text } = req.body;

  try {
    const [result] = await sequelize.query(`
      INSERT INTO reviews (film_id, user_id, rating, text)
      VALUES (?, ?, ?, ?)
    `, {
      replacements: [film_id, req.user.userId, rating, text]
    });

    const reviewId = result.insertId || result[0];

    res.status(201).json({
      review_id: reviewId,
      film_id,
      rating,
      text,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении отзыва' });
  }
});

module.exports = router;