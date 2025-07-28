const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require("../util/database");


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
    const t = await sequelize.transaction(); // Begin transaction
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.userId;

        // Create new expense inside transaction
        const newExpense = await Expense.create(
            { amount, description, category, UserId: userId },
            { transaction: t }
        );

        // Get current user details
        const user = await User.findByPk(userId, { transaction: t });

        if (!user) {
            throw new Error("User not found");
        }

        // Calculate new totalExpense
        const updatedTotal = Number(user.totalExpense || 0) + Number(amount);

        // Update totalExpense in the same transaction
        await User.update(
            { totalExpense: updatedTotal },
            { where: { id: userId }, transaction: t }
        );

        await t.commit(); // Commit transaction
        res.status(201).json(newExpense);

    } catch (err) {
        await t.rollback(); // Rollback on error
        console.error("Transaction failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find the expense that belongs to this user
    const expense = await Expense.findOne({
      where: { id, UserId: userId },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    const expenseAmount = Number(expense.amount);

    // Find user inside transaction
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    const currentTotal = Number(user.totalExpense);
    const newTotal = currentTotal - expenseAmount;

    // Update user's totalExpense
    await user.update({ totalExpense: newTotal }, { transaction: t });

    // Delete the expense
    await expense.destroy({ transaction: t });

    await t.commit(); // Commit the transaction
    res.status(200).json({ message: 'Expense deleted' });

  } catch (err) {
    await t.rollback(); // Rollback on error
    console.error("Delete Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


