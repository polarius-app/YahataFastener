const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yahata', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;