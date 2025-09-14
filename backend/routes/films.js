const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require("../middleware/auth")
const checkRole = require("../middleware/role")
const { QueryTypes } = require('sequelize')


router.get('/', async (req, res) => {
  const { search, genre } = req.query;
  let query = `
    SELECT 
      f.film_id,
      f.title,
      f.duration_min,
      f.rating,
      g.genre_name,
      AVG(r.rating) as avg_rating
    FROM films f
    JOIN genres g ON f.genre_id = g.genre_id
    LEFT JOIN reviews r ON f.film_id = r.film_id
    WHERE 1=1
  `;
  const replacements = [];

  if (search) {
    query += ` AND f.title LIKE ?`;
    replacements.push(`%${search}%`);
  }
  if (genre) {
    query += ` AND f.genre_id = ?`;
    replacements.push(genre);
  }

  query += ` GROUP BY f.film_id, f.title, f.duration_min, f.rating, g.genre_name`;

  try {
    const [films] = await sequelize.query(query, { replacements });
    console.log('Найдено фильмов:', films.length);
    res.json(films); // ← Возвращаем JSON
  } catch (err) {
    console.error('Ошибка при получении фильмов:', err);
    res.status(500).json({ error: 'Ошибка при получении фильмов' });
  }
});

router.post('/', async (req, res) => {
  const { title, genre_id, duration_min, rating } = req.body;

  // Проверка авторизации
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    // Проверка роли: только администратор (role_id = 3)
    if (payload.role_id !== 3) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    // Проверка данных
    if (!title || !genre_id || !duration_min || !rating) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ error: 'Рейтинг должен быть от 0 до 10' });
    }

    // Добавление фильма
    const [result] = await sequelize.query(`
      INSERT INTO films (title, genre_id, duration_min, rating)
      VALUES (?, ?, ?, ?)
    `, {
      replacements: [title, genre_id, duration_min, rating]
    });

    const filmId = result.insertId || result[0];

    res.status(201).json({
      film_id: filmId,
      title,
      genre_id,
      duration_min,
      rating,
      avg_rating: rating 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении фильма' });
  }
});


router.get('/:filmId', async (req, res) => {
  const { filmId } = req.params;

  try {
    const [films] = await sequelize.query(`
      SELECT f.*, g.genre_name
      FROM films f
      JOIN genres g ON f.genre_id = g.genre_id
      WHERE f.film_id = ?
    `, { replacements: [filmId] });

    if (films.length === 0) {
      return res.status(404).json({ error: 'Фильм не найден' });
    }

    res.json(films[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении фильма' });
  }
});

router.delete("/:filmId", authMiddleware, checkRole(['Администратор']), async (req, res) => {
  const { filmId } = req.params;

  try {
    console.log(`Attempting to DELETE film with film_id: ${filmId}`);
    
    const [results] = await sequelize.query(
      `DELETE FROM films WHERE film_id = ?`, 
      { 
        replacements: [filmId],
        type: QueryTypes.DELETE 
      }
    );

    const affectedRows = results?.affectedRows ?? results?.rowCount ?? 0;
    console.log("Affected rows:", affectedRows);
    
    if (affectedRows === 0) {
      return res.status(404).send({ message: "Фильм с таким ID для удаления не найден" });
    }

    return res.status(200).send({ message: "Фильм успешно удален" });

  } catch (error) {
    console.error("!!! ОШИБКА ПРИ УДАЛЕНИИ ФИЛЬМА:", error);
    return res.status(500).send({ message: "Ошибка на сервере при удалении фильма" });
  }
});

router.patch("/:filmId", authMiddleware, checkRole(["Администратор"]), async (req, res) => {
  const { filmId } = req.params;
  const body = req.body;

  // Оборачиваем ВСЁ в try...catch
  try { 
    const allowedFields = ['title', 'genre_id', 'duration_min', 'rating', 'description', 'release_date', 'poster_url', 'end_date'];
    const setClauses = [];
    const values = [];

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(body[key]);
      }
    });

    if (setClauses.length === 0) {
      return res.status(400).json({ message: "Нет полей для обновления" });
    }

    values.push(filmId);

    const sql = `UPDATE films SET ${setClauses.join(', ')} WHERE film_id = ?`;

    console.log("Executing SQL:", sql);
    console.log("With values:", values);
    
    const [results] = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.UPDATE
    });
    
    const affectedRows = results?.affectedRows

    console.log("Affected rows:", affectedRows);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Фильм не найден или данные не изменились" });
    }

    res.status(200).json({ message: "Фильм успешно обновлен" });

  } catch (error) {
    console.error("!!! ОШИБКА ПРИ ОБНОВЛЕНИИ ФИЛЬМА:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера", error: error.message });
  }
});


// backend/routes/films.js
router.get('/with-screenings', async (req, res) => {
  const { day } = req.query;

  try {
    const now = new Date();
    let startDate, endDate;

    if (day === 'tomorrow') {
      // Завтра: начало завтрашнего дня
      startDate = new Date(now);
      startDate.setDate(now.getDate() + 1);
      startDate.setHours(0, 0, 0, 0);

      // Конец завтрашнего дня
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Сегодня: начало сегодняшнего дня
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      // Конец сегодняшнего дня
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

    const [films] = await sequelize.query(`
      SELECT 
        f.film_id,
        f.title,
        f.genre_name,
        f.duration_min,
        f.avg_rating,
        f.poster_url,
        s.screening_id,
        s.start_time,
        s.base_price,
        h.hall_name
      FROM films f
      JOIN screenings s ON f.film_id = s.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.is_active = TRUE
        AND s.start_time >= ?
        AND s.start_time <= ?
      ORDER BY s.start_time
    `, {
      replacements: [startDate, endDate]
    });

    // Группируем по фильму
    const grouped = {};
    films.forEach(row => {
      if (!grouped[row.film_id]) {
        grouped[row.film_id] = {
          film_id: row.film_id,
          title: row.title,
          genre_name: row.genre_name,
          duration_min: row.duration_min,
          avg_rating: row.avg_rating,
          poster_url: row.poster_url,
          screenings: []
        };
      }
      grouped[row.film_id].screenings.push({
        screening_id: row.screening_id,
        start_time: row.start_time,
        base_price: row.base_price,
        hall_name: row.hall_name
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Ошибка в /with-screenings:', err);
    res.status(500).json({ error: 'Ошибка при получении расписания' });
  }
});

module.exports = router;