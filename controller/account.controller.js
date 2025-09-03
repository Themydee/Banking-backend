const { Account, Customer, Transaction } = require("../models");
const logger = require("../utils/logger");

const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const generateUniqueAccountNumber = async () => {
    let accountNumber, existingAccount, attempts = 0;
    do {
        accountNumber = generateAccountNumber();
        existingAccount = await Account.findOne({ where: { account_number: accountNumber } });
        attempts++;
    } while (existingAccount && attempts < 5);

    if (existingAccount) throw new Error("Unable to generate unique account number after several attempts.");
    return accountNumber;
}

const createAccount = async (req, res) => { 
    try {
        const { customerId, type } = req.body;
        if(!customerId || !type) return res.status(400).json({ message: "Customer ID and account type are required." });

        const customer = await Customer.findByPk(customerId);
        if(!customer || !customer.isVerified) return res.status(404).json({ message: "Verified Customer not found." });

        const accountNumber = await generateUniqueAccountNumber();
        const account = await Account.create({ account_number: accountNumber, type, customerId });

        logger.info(`Account created: ${account.account_number} for Customer ID: ${customerId}`);
        res.status(201).json({ message: "Account created successfully.", account });
    } catch (error) {
        logger.error(`Create account error: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}


const getAccount = async (req, res) => {
    try {
        const { account_number } = req.params;
        const account = await Account.findOne({ where: { account_number }, include: [{ model: Customer,  as: 'customer', attributes: ['id', 'name', 'email'] }], });
        if (!account) return res.status(404).json({ message: "Account not found." });

        res.status(200).json({ account });
    } catch (error) {
        logger.error(`Get account error: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
const updateAccount = async (req, res) => { 
    try {
        const { account_number } = req.params;
        const { balance, type, status } = req.body;
        const account = await Account.findOne({ where: { account_number } });
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }

        if (balance !== undefined) account.balance = balance;
        if (type) account.type = type;
        if (status) account.status = status;
        
        await account.save();
        logger.info(`Account updated: ${account.account_number}`);
        res.status(200).json({ message: "Account updated successfully.", account });
    } catch (error) {
        logger.error(`Update account error: ${error.message}`);
        res.status(500).json({ error: error.message || 'Internal server error' });  
    }
 };
const deleteAccount = async (req, res) => { 
    try {
        const { account_number } = req.params;

        // Find the account
        const account = await Account.findOne({ where: { account_number } });
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }

        // If account is not closed, close it first
        if (account.status !== 'closed') {
            account.status = 'closed';
            await account.save();
            logger.info(`Account closed: ${account.account_number}`);
            return res.status(200).json({ 
                message: "Account closed successfully. You can now delete the account." 
            });
        }

        // If account is already closed, delete it
        await account.destroy();
        logger.info(`Account deleted: ${account.account_number}`);
        res.status(200).json({ message: "Account deleted successfully." });

    } catch (error) {
        logger.error(`Delete account error: ${error.message}`); 
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};


module.exports = { createAccount, getAccount, updateAccount, deleteAccount };
