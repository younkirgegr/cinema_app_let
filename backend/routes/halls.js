// backend/routes/halls.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');


router.get('/', async (req, res) => {
  try {
    const [halls] = await sequelize.query(`
      SELECT 
        hall_id,
        hall_name,
        capacity
      FROM halls
      ORDER BY hall_name
    `);
    res.json(halls);
  } catch (err) {
    console.error('Ошибка при получении залов:', err);
    res.status(500).json({ error: 'Ошибка при получении залов' });
  }
});

module.exports = router;