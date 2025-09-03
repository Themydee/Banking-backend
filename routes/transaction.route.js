const express = require('express');
const { deposit, withdraw, transfer } = require('../controller/transaction.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

// Deposit funds
router.post('/deposit', authenticate, deposit);

// Withdraw funds
router.post('/withdraw', authenticate,  withdraw);

// Transfer funds between accounts
router.post('/transfer', authenticate, transfer);

module.exports = router;