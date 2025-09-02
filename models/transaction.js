const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Account = require("./account");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
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
  fromAccountId: {
    type: DataTypes.INTEGER,
    references: {
      model: Account,
      key: "id",
    },
  },
  toAccountId: {
    type: DataTypes.INTEGER,
    references: {
      model: Account,
      key: "id",
    },
  },
  accountId: {
    type: DataTypes.INTEGER,
    references: {
      model: Account,
      key: "id",
    },
  },
});

module.exports = Transaction;
