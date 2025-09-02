const sequelize = require('../config/db');
const Customer = require('../models/customer');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

async function syncDb() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Database sync error:', error.message);
  } finally {
    await sequelize.close();
  }
}

syncDb();