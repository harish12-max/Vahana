const express = require('express');

const {
  getVehiclesForAdmin,
  updateVehicleVerification,
} = require('../controllers/vehicle.controller');
const { getDocumentsForAdmin, downloadAdminDocument, updateDocumentVerification } = require('../controllers/document.controller');
const { USER_ROLES } = require('../models/user.model');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/require-role');

const router = express.Router();

router.use(authenticate, requireRole(USER_ROLES.ADMIN));

router.get('/vehicles', getVehiclesForAdmin);
router.patch('/vehicles/:vehicleId/verification', updateVehicleVerification);
router.get('/documents', getDocumentsForAdmin);
router.get('/documents/:documentId/file', downloadAdminDocument);
router.patch('/documents/:documentId/verification', updateDocumentVerification);

module.exports = router;
