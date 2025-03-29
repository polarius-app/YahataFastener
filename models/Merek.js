// models/Merek.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Merek = sequelize.define('tb_merek', {
  id_merek: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_merek: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'tb_merek',
  timestamps: false
});

module.exports = Merek;