// routes/admin.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const checkRole = require('../middleware/role');

/**
 * POST /api/admin/films
 * Добавляет новый фильм (только для администратора)
 */
router.post('/films', checkRole(['Администратор']), async (req, res) => {
  const { title, genre_id, duration_min, rating, description } = req.body;

  try {
    const [result] = await sequelize.query(
      'INSERT INTO films (title, genre_id, duration_min, rating, description) VALUES (?, ?, ?, ?, ?)',
      { replacements: [title, genre_id, duration_min, rating, description] }
    );

    // Логируем действие
    await sequelize.query(
      'INSERT INTO audit_log (action, user_id, details) VALUES (?, ?, ?)',
      { replacements: ['add_film', req.user.user_id, `Добавлен фильм: ${title}`] }
    );

    res.status(201).json({ 
      film_id: result.insertId, 
      message: 'Фильм добавлен' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось добавить фильм' });
  }
});

module.exports = router;