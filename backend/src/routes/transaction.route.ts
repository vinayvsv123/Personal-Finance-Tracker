import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { transactionSchema } from '../validators/transaction.validator.js';

const router = Router();

// Protect all transaction routes
router.use(authMiddleware);

// Apply validation to transaction creation
router.post('/', validateRequest(transactionSchema), createTransaction);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', validateRequest(transactionSchema.partial()), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
