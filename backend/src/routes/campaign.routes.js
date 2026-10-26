const express = require('express');
const controller = require('../controllers/campaign.controller');
const { USER_ROLES } = require('../models/user.model');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/require-role');

const router = express.Router();
router.use(authenticate);
router.get('/advertiser', requireRole(USER_ROLES.ADVERTISER), controller.getMyCampaigns);
router.post('/advertiser', requireRole(USER_ROLES.ADVERTISER), controller.createCampaign);
router.get('/advertiser/:campaignId', requireRole(USER_ROLES.ADVERTISER), controller.getMyCampaign);
router.patch('/advertiser/:campaignId', requireRole(USER_ROLES.ADVERTISER), controller.updateCampaign);
router.get('/available', requireRole(USER_ROLES.AUTO_OWNER), controller.availableCampaigns);
router.post('/:campaignId/join', requireRole(USER_ROLES.AUTO_OWNER), controller.joinCampaign);
router.get('/participations/me', requireRole(USER_ROLES.AUTO_OWNER), controller.myParticipations);
router.patch('/participations/:participationId', requireRole(USER_ROLES.AUTO_OWNER), controller.endParticipation);
module.exports = router;
