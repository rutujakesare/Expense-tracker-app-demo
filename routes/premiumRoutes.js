const express = require('express');

const router = express.Router();

const premiumController = require('../controllers/premiumController');
const authenticate = require('../middleware/authenticate');

router.get('/showleaderboard', authenticate, premiumController.getLeaderBoard);

module.exports = router;