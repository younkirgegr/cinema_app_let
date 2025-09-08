// middleware/auth.js
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: decoded.user_id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

module.exports = auth;