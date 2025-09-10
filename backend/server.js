// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем роуты
const filmRoutes = require('./routes/films');
const authRoutes = require('./routes/auth');
const screeningsRoutes = require('./routes/screenings');
const ticketsRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');
const myTicketsRoutes = require('./routes/my-tickets');
const reviewsRoutes = require('./routes/reviews');

// Подключаем маршруты к API
app.use('/api/films', filmRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/screenings', screeningsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewsRoutes);

// Главная страница (проверка)
app.get('/', (req, res) => {
  res.send('🎉 Бэкенд кинотеатра работает!');
});

// Подключение к базе и запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log('✅ Подключение к базе данных успешно');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к базе:', err);
    app.listen(PORT, () => {
      console.log(`⚠️ База недоступна, но сервер запущен`);
    });
  });