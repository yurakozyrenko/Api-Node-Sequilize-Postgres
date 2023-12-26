const sequelize = require('../models/index');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female'),
            allowNull: true,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        createdAt: 'registrationDate',
    }
);

module.exports = { User };
