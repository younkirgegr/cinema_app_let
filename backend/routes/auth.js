const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

router.post('/login', async (req, res) => {
  console.log('🔹 req.body:', req.body);

  const { email, password } = req.body;

  // Проверка: пришли ли email и password
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Требуются email и пароль' 
    });
  }

  try {
    const testHash = '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u';
    const isMatchTest = await bcrypt.compare('password123', testHash);
    console.log('🔹 Тест bcrypt.compare("password123", хэш):', isMatchTest); 
    // Поиск пользователя по email
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: [email]
    });

    // Проверка: пользователь найден?
    if (users.length === 0) {
      console.log(' Пользователь с email:', email, 'не найден');
      return res.status(400).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    const user = users[0];
    console.log(' Пользователь найден:', user.email);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('🔹 Сравнение пароля с базой:', isMatch); 

    if (!isMatch) {
      console.log(' Пароль не совпадает');
      return res.status(400).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id  
      }
    });

  } catch (err) {
    console.error(' Ошибка при входе:', err);
    res.status(500).json({ 
      error: 'Ошибка сервера при входе' 
    });
  }
});

module.exports = router;
