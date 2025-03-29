const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DaftarKategori = sequelize.define('tb_daftar_kategory', {
  id_daftar_masalah: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tb_daftar_masalah', // Nama tabel pengaduan
      key: 'id_daftar_masalah'
    }
  },
  id_kategori_masalah: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tb_kategori_masalah', // Nama tabel kategori
      key: 'id_kategori_masalah'
    }
  }
}, {
  tableName: 'tb_daftar_kategory',
  timestamps: false
});

module.exports = DaftarKategori;