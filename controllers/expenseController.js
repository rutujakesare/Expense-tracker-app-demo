const Expense = require('../models/expense');

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const newExpense = await Expense.create({ amount, description, category });
        res.json(newExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.destroy({ where: { id } });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;
        await Expense.update({ amount, description, category }, { where: { id } });
        res.json({ message: 'Expense updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
