const User = require('../models/user');
const Expense = require("../models/expense");
const sequelize = require('../util/database');


exports.getLeaderBoard = async (req, res) => {
    try {
        console.log("GET /premium/showleaderboard called");

        const leaderboardData = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json(leaderboardData);
    } catch (err) {
        console.error("Leaderboard error:", err); // <- See this in terminal
        res.status(500).json({ error: 'Internal server error' });
    }
};
