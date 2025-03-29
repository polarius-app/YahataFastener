const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KategoriMasalah = sequelize.define('tb_kategori_masalah', {
  id_kategori_masalah: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_kategori: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'tb_kategori_masalah',
  timestamps: false
});

module.exports = KategoriMasalah;
