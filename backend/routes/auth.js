const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await sequelize.query(`
      SELECT user_id, first_name, email, password_hash, role_id
      FROM users
      WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = users[0];

    // Простая проверка пароля (для теста)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = Buffer.from(`${user.user_id}.${user.role_id}`).toString('base64');

    res.json({
      token,
      user: {
        first_name: user.first_name,
        role_id: user.role_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

module.exports = router;