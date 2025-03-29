// models/Departemen.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Departemen = sequelize.define('tb_departemen', {
  id_departemen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departemen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'tb_departemen',
  timestamps: false
});

module.exports = Departemen;