const Customer = require('../models/customer');


// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const newCustomer = await Customer.create({ name, email, phone, password });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a customer by ID
exports.getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);               

    if (!customer) {        
        return res.status(404).json({ message: 'Customer not found' }); 
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;
    const customer = await Customer.findByPk(id);

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update({ name, email, phone, password });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}           
