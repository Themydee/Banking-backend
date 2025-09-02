const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
    },

    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },

    type: {
        type: DataTypes.STRING,
        defaultValue: 'savings',
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },

    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id'
        },
    },

})

module.exports = Account;