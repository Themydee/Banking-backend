const express = require('express');
const { 
  registerCustomer, 
  loginCustomer, 
  verifyCustomer 
} = require('../controller/auth.controller');

const router = express.Router();

//  Register new customer
router.post('/register', registerCustomer);

// Login customer
router.post('/login', loginCustomer);

//  Verify customer (simulate verification) 
router.patch('/verify/:token', verifyCustomer);

module.exports = router;
