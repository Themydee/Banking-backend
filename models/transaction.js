const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Account = require("../models/account");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {
    type: DataTypes.ENUM("deposit", "withdraw", "transfer"),
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  // For transfers
  fromAccountId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Account,
      key: "id",
    },
  },

  toAccountId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Account,
      key: "id",
    },
  },
}, {
  tableName: "Transactions",
  timestamps: false, 
});

module.exports = Transaction;
