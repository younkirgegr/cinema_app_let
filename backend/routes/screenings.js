const express = require('express');
const router = express.Router();
const  sequelize  = require('../config/database');


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



module.exports = router;