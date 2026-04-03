import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, ROLES } from "../middleware/rbac.js";

// All user-management routes require authentication AND admin role
router.use(authenticate, authorize(ROLES.ADMIN));

// GET    /api/users
router.get("/", getAllUsers);

// GET    /api/users/:id
router.get("/:id", getUserById);

// PATCH  /api/users/:id
router.patch("/:id", updateUser);

// DELETE /api/users/:id
router.delete("/:id", deleteUser);

export default router;
