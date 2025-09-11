const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cinema', 'root', 'masha2005', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize; 