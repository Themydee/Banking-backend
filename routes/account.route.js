const express = require('express');
const { createAccount, getAccount, updateAccount, deleteAccount } = require('../controller/account.controller');
const router = express.Router();

// Create a new account
router.post('/', createAccount);

// Get account details by account number
router.get('/:account_number', getAccount);

// Update account details by ID
router.put('/:account_number', updateAccount);

// Delete an account by ID
router.delete('/:id', deleteAccount);

module.exports = router;