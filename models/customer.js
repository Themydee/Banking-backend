const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
}, {
  tableName: 'Customers',
  timestamps: true,
});

module.exports = Customer;
