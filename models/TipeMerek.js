// models/TipeMerek.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipeMerek = sequelize.define('tb_tipe_merek', {
  id_tipe_merek: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_tipe_merek: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
}, {
  tableName: 'tb_tipe_merek',
  timestamps: false
});

module.exports = TipeMerek;