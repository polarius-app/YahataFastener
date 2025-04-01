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
  },
  id_asset: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tb_asset', // Nama tabel yang menjadi referensi
      key: 'id_asset' // Nama kolom yang menjadi referensi
    },
    onDelete: 'CASCADE', // Jika data di tb_asset dihapus, maka data di tb_software juga akan dihapus
  }
}, {
  tableName: 'tb_software',
  timestamps: false
});

module.exports = Software;