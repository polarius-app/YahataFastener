const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DaftarMasalah = sequelize.define('tb_daftar_masalah', {
  id_daftar_masalah: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  departemen: {
    type: DataTypes.ENUM('HDGA','STAFF','MARKETING','QUALITY','ACCOUNTING','SALES','PURCHASE','QC','PPIC','ADVISOR','DIRECTOR','PRCL'), // Sesuai ENUM di DB
    allowNull: false,
    defaultValue: 'STAFF'
  },
  tanggal_kejadian: {
    type: DataTypes.DATEONLY, // Sesuai struktur DB
    allowNull: false
  },
  waktu_kejadian: {
    type: DataTypes.TIME,
    allowNull: false
  },
  kendala_masalah: {
    type: DataTypes.STRING(500), // VARCHAR(500) sesuai DB
    allowNull: false
  },
  tanggal_perbaikan: {
    type: DataTypes.DATEONLY, // DATE sesuai DB
    allowNull: true
  },
  waktu_perbaikan: {
    type: DataTypes.TIME,
    allowNull: true
  },
  perbaikan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'close'), // Sesuai ENUM di DB
    allowNull: false,
    defaultValue: 'open'
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tb_daftar_masalah',
  timestamps: false
});

module.exports = DaftarMasalah;