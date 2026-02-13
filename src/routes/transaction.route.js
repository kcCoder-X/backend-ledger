const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

const transactionRouter = Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRouter.post('/', authMiddleware, transactionController.createTransaction);

module.exports = transactionRouter;