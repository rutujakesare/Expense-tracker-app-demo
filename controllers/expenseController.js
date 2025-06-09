const Expense = require('../models/expense');
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const expenses = await Expense.findAll({ where: { UserId: userId } }); 
        res.json(expenses);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.userId;

        const newExpense = await Expense.create({ amount, description, category, UserId: userId }); 
     
        res.json(newExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const expense = await Expense.findOne({ where: { id, UserId: userId } }); 

        if (!expense) {
            return res.status(403).json({ message: 'Not authorized to delete this expense' });
        }

        await expense.destroy();
     

        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;
        const userId = req.user.userId;

        const expense = await Expense.findOne({ where: { id, UserId: userId } }); 
        if (!expense) {
            return res.status(403).json({ message: 'Not authorized to update this expense' });
        }

        await expense.update({ amount, description, category });
        res.json({ message: 'Expense updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};