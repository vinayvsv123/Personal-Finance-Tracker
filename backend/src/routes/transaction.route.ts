import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = Router();

// Protect all transaction routes
router.use(authMiddleware);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
