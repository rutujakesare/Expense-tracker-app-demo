const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');

router.get('/premium', paymentController.getPremiumPage);
router.get('/payment-status/:paymentSessionId', paymentController.updatePremiumStatus);
router.post('/buy-premium', authenticate, paymentController.buyPremium);


module.exports = router;


