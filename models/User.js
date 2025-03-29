const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    jabatan: {
        type: DataTypes.ENUM('Manager', 'Supervisor', 'Staff'),
        allowNull: false,
        defaultValue: 'Staff'
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    tanggal_masuk: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('aktif', 'tidak_aktif'),
        allowNull: false,
        defaultValue: 'aktif'
    },
    foto: {
        type: DataTypes.BLOB('medium'),
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;