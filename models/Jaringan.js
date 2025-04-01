// models/Jaringan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Jaringan = sequelize.define('tb_jaringan', {
  id_jaringan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mac_address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pic_microtik: {
    type: DataTypes.BLOB('medium'),
    allowNull: true
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
  tableName: 'tb_jaringan',
  timestamps: false
});

module.exports = Jaringan;