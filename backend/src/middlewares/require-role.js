const { USER_ROLES } = require('../models/user.model');

const validRoles = Object.values(USER_ROLES);

const requireRole = (...allowedRoles) => {
  if (allowedRoles.some((role) => !validRoles.includes(role))) {
    throw new Error('requireRole received an unknown role.');
  }

  return (req, res, next) => {
    if (!req.auth || !req.auth.userId || !req.auth.role) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication is required.' },
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'You do not have permission to access this resource.' },
      });
    }

    return next();
  };
};

module.exports = requireRole;
