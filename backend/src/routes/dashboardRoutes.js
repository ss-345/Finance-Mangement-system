import express from 'express';
const router = express.Router();

import {
  getSummary,
  getRecentActivity,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize, ROLES } from '../middleware/rbac.js';

// All dashboard routes require authentication
router.use(authenticate);

// Viewers can see summary and recent activity
// Analysts and Admins get full access

// GET /api/dashboard/summary
router.get(
  '/summary',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  getSummary
);

// GET /api/dashboard/recent-activity
router.get(
  '/recent-activity',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  getRecentActivity
);

// The following are analyst/admin only — deeper insights
router.get(
  '/category-totals',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  getCategoryTotals
);

router.get(
  '/monthly-trends',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  getMonthlyTrends
);

router.get(
  '/weekly-trends',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  getWeeklyTrends
);

export default router;
