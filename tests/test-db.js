const sequelize = require('../config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL successful!');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();