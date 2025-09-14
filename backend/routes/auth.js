const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // ← добавь импорт
const sequelize = require('../config/database');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ищем пользователя по email
    const [users] = await sequelize.query(`
      SELECT user_id, first_name, email, password_hash, role_id
      FROM users
      WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign({
    user_id:user.user_id,
    role_id:user.role_id,
    },
    "VERY_HARD_SECRET_KEY",
    {expiresIn: '12h'})

    res.json({
    user:{
        token:token,
        first_name:user.first_name,
          role_id:user.role_id
      }
    });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
});

module.exports = router;