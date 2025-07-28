const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();


router.get('/', authenticate, expenseController.getExpenses);
router.post('/', authenticate, expenseController.createExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
