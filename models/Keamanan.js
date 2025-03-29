// models/Keamanan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Keamanan = sequelize.define('tb_keamanan', {
    id_kredensial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
  tableName: 'tb_keamanan',
  timestamps: false
});

module.exports = Keamanan;