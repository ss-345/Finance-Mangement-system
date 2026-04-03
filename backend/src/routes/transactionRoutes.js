import express from 'express';
const router = express.Router();

import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize, ROLES } from '../middleware/rbac.js';
import {
  createTransactionValidator,
  updateTransactionValidator,
  filterQueryValidator,
} from '../validators/transactionValidators.js';

// All transaction routes require authentication
router.use(authenticate);

// GET  /api/transactions  — viewer, analyst, admin can view
router.get(
  '/',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  filterQueryValidator,
  getAllTransactions
);

// GET  /api/transactions/:id
router.get(
  '/:id',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  getTransactionById
);

// POST /api/transactions  — admin only
router.post(
  '/',
  authorize(ROLES.ADMIN),
  createTransactionValidator,
  createTransaction
);

// PUT  /api/transactions/:id  — admin only
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  updateTransactionValidator,
  updateTransaction
);

// DELETE /api/transactions/:id  — admin only
router.delete('/:id', authorize(ROLES.ADMIN), deleteTransaction);

export default router;
