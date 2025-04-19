const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Apply auth middleware to all routes
router.get('/', authenticate, expenseController.getExpenses);
router.post('/', authenticate, expenseController.createExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);
router.put('/:id', authenticate, expenseController.updateExpense);

module.exports = router;
