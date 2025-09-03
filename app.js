const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/db');
const logger = require('./utils/logger');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

const customerRoutes = require('./routes/customer.route');
const authRoutes = require('./routes/auth.route');
const accountRoutes = require('./routes/account.route');
const transactionRoutes = require('./routes/transaction.route');
// Example test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running OK 🚀' });
});

// All routes

app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transactions', transactionRoutes);


// Database sync + server start
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
  })
  .catch((err) => logger.error(`Database sync error: ${err.message}`));
