const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

// router.get('/', expenseController.getExpense);

router.get('/get-expenses/', userAuthentication.authenticate, expenseController.getExpenses);

router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.postDeleteExpense);

router.get('/download', userAuthentication.authenticate, expenseController.uploadFile);

router.get('/download/getfiles', userAuthentication.authenticate, expenseController.getfiles);

router.get("/leaderboard", userAuthentication.authenticate, expenseController.getpremiumFeature);

module.exports = router ;