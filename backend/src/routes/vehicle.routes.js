const express = require('express');

const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
} = require('../controllers/vehicle.controller');
const { USER_ROLES } = require('../models/user.model');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/require-role');

const router = express.Router();

router.use(authenticate, requireRole(USER_ROLES.AUTO_OWNER));

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:vehicleId', getVehicle);
router.patch('/:vehicleId', updateVehicle);

module.exports = router;
