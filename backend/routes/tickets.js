const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');


router.post('/sell', async (req, res) => {
  const { screening_id, seat_id, user_id } = req.body;

  try {
    // Проверка: сеанс существует
    const [screening] = await sequelize.query(`
      SELECT s.screening_id, s.capacity, s.base_price
      FROM screenings s
      WHERE s.screening_id = ?
      AND s.is_active = TRUE
    `, { replacements: [screening_id] });

    if (!screening.length) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }

    if (!screening[0].base_price) {
      return res.status(400).json({ error: 'Цена сеанса не указана' });
    }

    // Проверка: место свободно
    const [takenSeats] = await sequelize.query(`
      SELECT seat_id
      FROM tickets t
      WHERE t.screening_id = ?
      AND t.seat_id = ?
    `, { replacements: [screening_id, seat_id] });

    if (takenSeats.length > 0) {
      return res.status(400).json({ error: 'Место уже занято' });
    }

    // Создание билета
    const [result] = await sequelize.query(`
      INSERT INTO tickets (screening_id, seat_id, user_id, price)
      VALUES (?, ?, ?, ?)
    `, { 
      replacements: [screening_id, seat_id, user_id, screening[0].base_price],
      type: sequelize.QueryTypes.INSERT 
    });

    // Получаем ID вставленной записи
    const ticketId = result; 

    res.json({
      ticket_id: ticketId,
      screening_id,
      seat_id,
      user_id,
      price: screening[0].base_price
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при продаже билета' });
  }
});


router.get('/my', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const user_id = payload.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const [tickets] = await sequelize.query(`
      SELECT 
        t.ticket_id,
        f.title,
        h.hall_name,
        s.start_time,
        t.seat_id,
        t.price,
        t.created_at
      FROM tickets t
      JOIN screenings s ON t.screening_id = s.screening_id
      JOIN films f ON s.film_id = f.film_id
      JOIN halls h ON s.hall_id = h.hall_id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, { replacements: [user_id] });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении билетов' });
  }
});

router.get('/occupied/:screening_id', async (req, res) => {
  const { screening_id } = req.params;

  try {
    const [occupiedSeats] = await sequelize.query(`
      SELECT seat_id
      FROM tickets
      WHERE screening_id = ?
    `, { replacements: [screening_id] });

    // Возвращаем только seat_id
    res.json(occupiedSeats.map(s => s.seat_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении занятых мест' });
  }
});

module.exports = router;