module.exports = (req, res, next) => {
  // Получаем заголовок Authorization
  const jwt = require('jsonwebtoken')
  const authHeader = req.headers.authorization;

  // Проверяем, что заголовок существует
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

// Разделяем на части: ['Bearer', 'токен']
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: 'Неверный формат токена. Ожидается "Bearer <token>"' 
    });
  }

   const token = parts[1];

  jwt.verify(token, "VERY_HARD_SECRET_KEY", (err, tokenData) => {
        if (err) return res.status(401).json({ error: "Неверный или повреждённый токен" });
        req.user = {
        userId: tokenData.user_id,
        role_id: tokenData.role_id
  }
        next();
    });

};