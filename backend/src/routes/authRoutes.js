import express from 'express';
const router = express.Router();

import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, getMe);

export default router;
