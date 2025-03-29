// models/Software.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Software = sequelize.define('tb_software', {
  id_software: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_software: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  kunci_lisensi: {
    type: DataTypes.STRING(100), // Berelasi dengan tb_asset
    allowNull: false
  }
}, {
  tableName: 'tb_software',
  timestamps: false
});

module.exports = Software;