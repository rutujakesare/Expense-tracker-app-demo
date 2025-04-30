const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticate = require('../middleware/authenticate');

router.get('/premiummembership', authenticate, purchaseController.purchasePremium);
router.get('/update-status', purchaseController.updateTransactionStatus);

module.exports = router;
