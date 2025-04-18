const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.delete('/:id', expenseController.deleteExpense);
router.put('/:id', expenseController.updateExpense);

module.exports = router;
