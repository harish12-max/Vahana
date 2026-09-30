const express = require('express');

const {
  createAdvertiserProfile,
  getAdvertiserProfile,
  updateAdvertiserProfile,
  createAutoOwnerProfile,
  getAutoOwnerProfile,
  updateAutoOwnerProfile,
} = require('../controllers/profile.controller');
const { USER_ROLES } = require('../models/user.model');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/require-role');

const router = express.Router();

router.post(
  '/advertiser',
  authenticate,
  requireRole(USER_ROLES.ADVERTISER),
  createAdvertiserProfile,
);
router.get(
  '/advertiser',
  authenticate,
  requireRole(USER_ROLES.ADVERTISER),
  getAdvertiserProfile,
);
router.patch(
  '/advertiser',
  authenticate,
  requireRole(USER_ROLES.ADVERTISER),
  updateAdvertiserProfile,
);

router.post(
  '/auto-owner',
  authenticate,
  requireRole(USER_ROLES.AUTO_OWNER),
  createAutoOwnerProfile,
);
router.get(
  '/auto-owner',
  authenticate,
  requireRole(USER_ROLES.AUTO_OWNER),
  getAutoOwnerProfile,
);
router.patch(
  '/auto-owner',
  authenticate,
  requireRole(USER_ROLES.AUTO_OWNER),
  updateAutoOwnerProfile,
);

module.exports = router;
