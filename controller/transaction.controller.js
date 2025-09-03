const { Account, Transaction, sequelize } = require("../models");

const deposit = async (req, res) => {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Valid accountId and amount required." });
    }
    const t = await sequelize.transaction();
    try {
        const account = await Account.findByPk(accountId, { transaction: t });
        if (!account) throw new Error("Account not found.");

        account.balance = parseFloat(account.balance) + parseFloat(amount);
        await account.save({ transaction: t });

        await Transaction.create({
            type: "deposit",
            amount,
            toAccountId: accountId,
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "Deposit successful.", balance: account.balance });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

const withdraw = async (req, res) => {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Valid accountId and amount required." });
    }
    const t = await sequelize.transaction();
    try {
        const account = await Account.findByPk(accountId, { transaction: t });
        if (!account) throw new Error("Account not found.");
        if (parseFloat(account.balance) < parseFloat(amount)) throw new Error("Insufficient funds.");

        account.balance = parseFloat(account.balance) - parseFloat(amount);
        await account.save({ transaction: t });

        await Transaction.create({
            type: "withdraw",
            amount,
            fromAccountId: accountId,
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "Withdrawal successful.", balance: account.balance });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

const transfer = async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;
    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Valid fromAccountId, toAccountId, and amount required." });
    }
    const t = await sequelize.transaction();
    try {
        const fromAccount = await Account.findByPk(fromAccountId, { transaction: t });
        const toAccount = await Account.findByPk(toAccountId, { transaction: t });
        if (!fromAccount || !toAccount) throw new Error("Account(s) not found.");
        if (parseFloat(fromAccount.balance) < parseFloat(amount)) throw new Error("Insufficient funds.");

        fromAccount.balance = parseFloat(fromAccount.balance) - parseFloat(amount);
        toAccount.balance = parseFloat(toAccount.balance) + parseFloat(amount);

        await fromAccount.save({ transaction: t });
        await toAccount.save({ transaction: t });

        await Transaction.create({
            type: "transfer",
            amount,
            fromAccountId,
            toAccountId,
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "Transfer successful.", fromBalance: fromAccount.balance, toBalance: toAccount.balance });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

module.exports = { deposit, withdraw, transfer };