const express = require('express');
const { createAccount, getAccount, updateAccount, deleteAccount } = require('../controller/account.controller');
const authenticate = require('../middleware/auth.middleware');
const router = express.Router();

// Create a new account
router.post('/create', authenticate,  createAccount);

// Get account details by account number
router.get('/:account_number', authenticate, getAccount);

// Update account details by ID
router.put('/:account_number', authenticate, updateAccount);

// Delete an account by ID
router.delete('/:account_number', authenticate, deleteAccount);

module.exports = router;