/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Role Hierarchy:
 *   viewer   → Can read dashboard & transactions
 *   analyst  → viewer permissions + access to insight/summary endpoints
 *   admin    → Full access including user management and record mutation
 *
 * Usage:
 *   router.post('/transactions', authenticate, authorize('admin'), createTransaction)
 *   router.get('/transactions', authenticate, authorize('viewer', 'analyst', 'admin'), ...)
 */

/**
 * authorize(...roles)
 * Returns a middleware that checks if req.user.role is in the allowed roles list.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Safeguard: authenticate should always run before authorize
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

/**
 * Convenience role constants — avoids magic strings in route files.
 */
const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

export { authorize, ROLES };
