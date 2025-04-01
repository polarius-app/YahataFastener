// models/Spesifikasi.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Spesifikasi = sequelize.define('tb_spesifikasi', {
  id_spesifikasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spesifikasi: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deskripsi_spesifikasi: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_asset: {  // 🔹 Tambahkan foreign key
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'tb_asset',
        key: 'id_asset'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'tb_spesifikasi',
  timestamps: false
});

module.exports = Spesifikasi;