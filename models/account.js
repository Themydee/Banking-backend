const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('../models/customer');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { 
      len: [10, 10] 
    },
  },

  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },

  type: {
    type: DataTypes.ENUM('savings', 'current'), 
    defaultValue: 'savings',
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive', 'closed'),
    defaultValue: 'active',
  },

  customerId: {
    type: DataTypes.INTEGER,
    references: { 
      model: Customer, 
      key: 'id' 
    },
    allowNull: false,
  },
}, {
  tableName: 'Accounts', 
  timestamps: true,      
});

module.exports = Account;