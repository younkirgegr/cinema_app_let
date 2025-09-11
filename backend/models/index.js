const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const modelDefiners = [
  require('./Film'),
  require('./User')
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, Sequelize.DataTypes);
}

module.exports = sequelize;