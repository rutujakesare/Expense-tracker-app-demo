const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premiumController');
const authenticate = require('../middleware/authenticate');

router.get('/leaderboard', authenticate, leaderboardController.getLeaderboard);

module.exports = router;
