// backend/middleware/auth.js

 /**
  * Мидлваре для проверки авторизации.
  * Ожидает заголовок: Authorization: Bearer <token>
  * Токен должен быть в формате "userId.roleId", закодированном в base64 (например, Buffer.from("7.1").toString('base64') -> "Ny4x")
  */
module.exports = (req, res, next) => {
  // Получаем заголовок Authorization
  const authHeader = req.headers.authorization;

  // Проверяем, что заголовок существует
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
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
    
    let payload;

    // Пробуем сначала распарсить как JSON (на случай, если формат изменится на JWT)
    // В текущей реализации это, скорее всего, не сработает, и пойдет в catch
    try {
      payload = JSON.parse(decoded);
    } catch (e) {
      // Если JSON не распарсился, значит это строка "userId.roleId"
      const [userId, role_id] = decoded.split('.');
      if (!userId || !role_id) {
         throw new Error('Неверный формат данных в токене');
      }
      // Создаем payload в ожидаемом формате
      payload = {
        userId: parseInt(userId, 10),
        role_id: parseInt(role_id, 10)
      };
    }

    // Проверка на валидность числовых ID
    if (isNaN(payload.userId) || isNaN(payload.role_id)) {
       throw new Error('ID пользователя или роли не являются числами');
    }

    // Сохраняем в запрос для дальнейшего использования
    req.user = {
      userId: payload.userId,
      role_id: payload.role_id
    };

    // Передаём управление следующему обработчику
    next();
  } catch (err) {
    console.error('Ошибка при обработке токена:', err.message); // Логируем только сообщение об ошибке
    return res.status(401).json({ error: 'Неверный или повреждённый токен' });
  }
};