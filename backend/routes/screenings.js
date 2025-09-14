const express = require('express');
const router = express.Router();
const  sequelize  = require('../config/database');
const authMiddleware = require('../middleware/auth')
const checkRole = require('../middleware/role')
const {QueryTypes} = require('sequelize')

router.post("/", authMiddleware, checkRole(["Администратор"]), async (req, res) => {
  const { film_id, hall_id, start_time, base_price, end_time } = req.body;

  if (!film_id || !hall_id || !start_time || !base_price) {
    return res.status(400).send({ message: "Все поля обязательны для заполнения" });
  }

  try {
    const date = new Date(start_time);
    const date2 = new Date(end_time)
    if (isNaN(date.getTime()) && isNaN(date2.getTime())) {
      return res.status(400).send({ message: "Неверный формат времени. Ожидается строка в формате ISO 8601." });
    }


    await sequelize.query(
      `INSERT INTO screenings (film_id, hall_id, start_time, end_time, base_price) VALUES (?, ?, ?, ?, ?)`,
      { replacements: [film_id, hall_id, date, date2, base_price] }
    );

    return res.status(201).json({ message: "Сеанс успешно создан!" });

  } catch (error) {
    console.error("Ошибка при создании сеанса:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});


router.get('/film/:filmId', async (req, res) => {
  const { filmId } = req.params;
  try {
    const [screenings] = await sequelize.query(`
      SELECT 
        s.screening_id,
        s.start_time,
        s.base_price,
        h.hall_name
      FROM screenings s
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.film_id = ? AND s.is_active = TRUE
      ORDER BY s.start_time
    `, { replacements: [filmId] });

    console.log(`Найдено сеансов для фильма ${filmId}:`, screenings.length);
    res.json(screenings);
  } catch (err) {
    console.error('Ошибка получения сеансов:', err);
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
});


router.get('/details/:screeningId', async (req, res) => {
  const { screeningId } = req.params;
  try {
    const [data] = await sequelize.query(`
      SELECT 
        f.title,
        s.start_time,
        s.base_price,
        h.hall_name,
        h.row_count,
        h.seats_per_row
      FROM screenings s
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE s.screening_id = ?
        AND s.is_active = TRUE
    `, { replacements: [screeningId] });

    if (data.length === 0) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Ошибка при получении данных о сеансе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.get('/occupied/:screening_id', async (req, res) => {
  console.log('Details route called:', req.params); 
  const { screening_id } = req.params;

  try {
    // Проверяем, существует ли сеанс
    const [screening] = await sequelize.query(`
      SELECT screening_id FROM screenings WHERE screening_id = ? AND is_active = TRUE
    `, { replacements: [screening_id] });

    if (screening.length === 0) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    // Получаем все занятые места для этого сеанса
    const [occupiedSeats] = await sequelize.query(`
      SELECT seat_id 
      FROM tickets 
      WHERE screening_id = ?
    `, { replacements: [screening_id] });

    // Возвращаем только массив ID мест
    const seatIds = occupiedSeats.map(s => s.seat_id);

    res.json(seatIds);
  } catch (err) {
    console.error('Ошибка при получении занятых мест:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке занятых мест' });
  }
});
router.get("/all",authMiddleware,checkRole(["Администратор"]), async (req,res)=>{
  const [screenings] = await sequelize.query(`
    SELECT * FROM screenings
    `)

})
router.patch("/:screening_id",authMiddleware,checkRole(["Администратор"]),async (req,res)=>{
  const {screening_id} = req.params
 
  const body = req.body;


    const allowedFields = ['film_id', 'hall_id', 'start_time', 'end_time','base_price','is_active','is_vip'];

    const setClauses = [];
    const values = [];

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        if (key==='start_time' || key=='end_time') body[key] = new Date(body[key])
        values.push(body[key]);
      }
    });

    if (setClauses.length === 0) {
      return res.status(400).json({ message: "Нет полей для обновления" });
    }

    values.push(screening_id);

    const sql = `UPDATE screenings SET ${setClauses.join(', ')} WHERE screening_id = ?`;


    const [results] = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.UPDATE
    });

    const affectedRows = results.affectedRows || (Array.isArray(results) && results[1] ? results[1] : 0);

    if (affectedRows === 0) {
        return res.status(404).json({ message: "Фильм не найден или данные не изменились" });
    }

    res.json({ message: "Продукт успешно обновлен" });
})


module.exports = router;