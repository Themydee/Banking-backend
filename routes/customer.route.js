const express = require('express');
const { createCustomer, getCustomer, getAllCustomers, updateCustomer, deleteCustomer } = require('../controller/customer.controller');

const router = express.Router();
// create a new customer
router.post('/', createCustomer);

// get a customer by id
router.get('/:id', getCustomer);

// get all customers
router.get('/', getAllCustomers);

// update a customer by id
router.put('/:id', updateCustomer);

// delete a customer by id
router.delete('/:id', deleteCustomer);

module.exports = router;