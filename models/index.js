const sequelize = require('../config/db');
const Customer = require('../models/customer');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

// Associations

// 1. A customer can have many accounts
Customer.hasMany(Account, { foreignKey: 'customerId', as: 'accounts' });
Account.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// 2. An account can have many transactions (deposits, withdrawals, transfers)
Account.hasMany(Transaction, { foreignKey: 'fromAccountId', as: 'outgoingTransactions' });
Account.hasMany(Transaction, { foreignKey: 'toAccountId', as: 'incomingTransactions' });

// 3. Each transaction links back to accounts
Transaction.belongsTo(Account, { as: 'fromAccount', foreignKey: 'fromAccountId' });
Transaction.belongsTo(Account, { as: 'toAccount', foreignKey: 'toAccountId' });

module.exports = { Customer, Account, Transaction, sequelize };
