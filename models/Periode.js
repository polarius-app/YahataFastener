const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Periode = sequelize.define('tb_periode', {
  id_periode: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tahun_periode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isp_periode: {
    type: DataTypes.STRING(50), // Contoh, silakan sesuaikan
    allowNull: true
  }
}, {
  tableName: 'tb_periode',
  timestamps: false
});

module.exports = Periode;