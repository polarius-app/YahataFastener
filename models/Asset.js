// models/Asset.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asset = sequelize.define('tb_asset', {
  id_asset: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nc_asset: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  foto: {
    type: DataTypes.BLOB('medium'),
    allowNull: false
  },
  antivirus: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  hostname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tanggal_pembelian: {
    type: DataTypes.DATE,
    allowNull: false
  },
  umur_asset: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
}, {
  tableName: 'tb_asset',
  timestamps: false
});

module.exports = Asset;
