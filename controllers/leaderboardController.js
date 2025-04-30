const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (req, res) => {
  try {
    const usersWithExpenses = await User.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Expense,
          attributes: ['amount'],
        },
      ],
    });

    const leaderboard = usersWithExpenses.map(user => {
      const totalExpense = user.Expenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { name: user.name, totalExpense };
    });

    leaderboard.sort((a, b) => b.totalExpense - a.totalExpense);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Error loading leaderboard', error: err });
  }
};
