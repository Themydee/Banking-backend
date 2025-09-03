const express = require('express');
const { createCustomer, getCustomer, getAllCustomers, updateCustomer, deleteCustomer } = require('../controller/customer.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();
// create a new customer
router.post('/', authenticate, createCustomer);

// get a customer by id
router.get('/:id', authenticate, getCustomer);

// get all customers
router.get('/', authenticate, getAllCustomers);

// update a customer by id
router.put('/:id', authenticate, updateCustomer);

// delete a customer by id
router.delete('/:id', authenticate, deleteCustomer);

module.exports = router;