import { body, query } from 'express-validator';


const createTransactionValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'salary', 'freelance', 'investment', 'business',
      'rent', 'utilities', 'groceries', 'transport',
      'healthcare', 'entertainment', 'education', 'insurance', 'other',
    ]).withMessage('Invalid category'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateTransactionValidator = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

  body('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),

  body('category')
    .optional()
    .isIn([
      'salary', 'freelance', 'investment', 'business',
      'rent', 'utilities', 'groceries', 'transport',
      'healthcare', 'entertainment', 'education', 'insurance', 'other',
    ]).withMessage('Invalid category'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const filterQueryValidator = [
  query('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type filter must be income or expense'),

  query('category')
    .optional()
    .isIn([
      'salary', 'freelance', 'investment', 'business',
      'rent', 'utilities', 'groceries', 'transport',
      'healthcare', 'entertainment', 'education', 'insurance', 'other',
    ]).withMessage('Invalid category filter'),

  query('startDate')
    .optional()
    .isISO8601().withMessage('startDate must be a valid ISO 8601 date'),

  query('endDate')
    .optional()
    .isISO8601().withMessage('endDate must be a valid ISO 8601 date'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export {
  createTransactionValidator,
  updateTransactionValidator,
  filterQueryValidator,
};
