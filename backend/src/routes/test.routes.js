const express = require('express');

const { USER_ROLES } = require('../models/user.model');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/require-role');

const router = express.Router();

const sendRoleTestResponse = (requiredRole) => (req, res) => {
  res.status(200).json({
    success: true,
    data: { requiredRole },
  });
};

router.get('/admin', authenticate, requireRole(USER_ROLES.ADMIN), sendRoleTestResponse(USER_ROLES.ADMIN));
router.get(
  '/advertiser',
  authenticate,
  requireRole(USER_ROLES.ADVERTISER),
  sendRoleTestResponse(USER_ROLES.ADVERTISER),
);
router.get(
  '/auto-owner',
  authenticate,
  requireRole(USER_ROLES.AUTO_OWNER),
  sendRoleTestResponse(USER_ROLES.AUTO_OWNER),
);

module.exports = router;
