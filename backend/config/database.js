const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cinema', 'root', 'masha2005', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize; 