module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверяем, что заголовок существует
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Требуется авторизация' 
    });
  }

  // Разделяем на части: ['Bearer', 'токен']
  const parts = authHeader.split(' ');

  // Проверяем, что формат правильный: Bearer <token>
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: 'Неверный формат токена. Ожидается "Bearer <token>"' 
    });
  }

  // Извлекаем сам токен
  const token = parts[1];

  try {
    // Декодируем Base64
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    // Парсим как JSON или как строку userId.role_id
    let payload;
    try {
      payload = JSON.parse(decoded);
    } catch (e) {
      const [userId, role_id] = decoded.split('.');
      if (!userId || !role_id) {
        return res.status(401).json({ 
          error: 'Неверный формат данных в токене' 
        });
      }
      payload = { 
        userId: parseInt(userId), 
        role_id: parseInt(role_id) 
      };
    }

    // Сохраняем в запрос
    req.user = {
      userId: payload.userId,
      role_id: payload.role_id
    };

    // Передаём управление дальше
    next();
  } catch (err) {
    console.error('Ошибка при обработке токена:', err);
    return res.status(401).json({ 
      error: 'Неверный или повреждённый токен' 
    });
  }
};