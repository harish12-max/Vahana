const mongoose = require('mongoose');

const AutoOwnerProfile = require('../models/auto-owner-profile.model');
const Vehicle = require('../models/vehicle.model');
const { VEHICLE_VERIFICATION_STATUSES } = Vehicle;

const vehicleFields = ['registrationNumber', 'vehicleType', 'ownershipInformation'];

const sendInvalidRequest = (res, message) =>
  res.status(400).json({
    success: false,
    error: { message },
  });

const validateVehiclePayload = (body, requireAllFields) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be an object.';
  }

  const suppliedFields = Object.keys(body);
  const invalidField = suppliedFields.find((field) => !vehicleFields.includes(field));

  if (invalidField) {
    return `Field is not allowed: ${invalidField}.`;
  }

  if (requireAllFields) {
    const missingField = vehicleFields.find((field) => body[field] === undefined);

    if (missingField) {
      return `Missing required field: ${missingField}.`;
    }
  }

  const invalidType = suppliedFields.find((field) => typeof body[field] !== 'string');

  if (invalidType) {
    return `Field must be a string: ${invalidType}.`;
  }

  return null;
};

const pickVehicleFields = (body) =>
  vehicleFields.reduce((fields, field) => {
    if (body[field] !== undefined) {
      fields[field] = body[field];
    }

    return fields;
  }, {});

const getAuthenticatedOwnerProfile = async (userId) =>
  AutoOwnerProfile.findOne({ user: userId });

const handleVehicleError = (error, res, next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return sendInvalidRequest(res, 'Invalid vehicle data.');
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      error: { message: 'A vehicle with this registration number already exists.' },
    });
  }

  return next(error);
};

const getOwnerProfileOrRespond = async (req, res) => {
  const ownerProfile = await getAuthenticatedOwnerProfile(req.auth.userId);

  if (!ownerProfile) {
    res.status(404).json({
      success: false,
      error: { message: 'Auto owner profile not found.' },
    });
    return null;
  }

  return ownerProfile;
};

const createVehicle = async (req, res, next) => {
  const validationError = validateVehiclePayload(req.body, true);

  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  try {
    const ownerProfile = await getOwnerProfileOrRespond(req, res);
    if (!ownerProfile) {
      return undefined;
    }

    const vehicle = await Vehicle.create({
      owner: ownerProfile._id,
      ...pickVehicleFields(req.body),
    });

    return res.status(201).json({ success: true, data: { vehicle } });
  } catch (error) {
    return handleVehicleError(error, res, next);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const ownerProfile = await getOwnerProfileOrRespond(req, res);
    if (!ownerProfile) {
      return undefined;
    }

    const vehicles = await Vehicle.find({ owner: ownerProfile._id }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: { vehicles } });
  } catch (error) {
    return next(error);
  }
};

const getVehicle = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.vehicleId)) {
    return sendInvalidRequest(res, 'Invalid vehicle ID.');
  }

  try {
    const ownerProfile = await getOwnerProfileOrRespond(req, res);
    if (!ownerProfile) {
      return undefined;
    }

    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      owner: ownerProfile._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.' },
      });
    }

    return res.status(200).json({ success: true, data: { vehicle } });
  } catch (error) {
    return next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.vehicleId)) {
    return sendInvalidRequest(res, 'Invalid vehicle ID.');
  }

  const validationError = validateVehiclePayload(req.body, false);
  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  const updates = pickVehicleFields(req.body);
  if (Object.keys(updates).length === 0) {
    return sendInvalidRequest(res, 'At least one vehicle field is required.');
  }

  try {
    const ownerProfile = await getOwnerProfileOrRespond(req, res);
    if (!ownerProfile) {
      return undefined;
    }

    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      owner: ownerProfile._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.' },
      });
    }

    Object.assign(vehicle, updates);
    vehicle.verificationStatus = VEHICLE_VERIFICATION_STATUSES.PENDING;
    await vehicle.save();

    return res.status(200).json({ success: true, data: { vehicle } });
  } catch (error) {
    return handleVehicleError(error, res, next);
  }
};

const getVehiclesForAdmin = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find()
      .sort({ createdAt: -1 })
      .populate('owner', 'user address city locality pincode verificationStatus');

    return res.status(200).json({ success: true, data: { vehicles } });
  } catch (error) {
    return next(error);
  }
};

const updateVehicleVerification = async (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.vehicleId)) {
    return sendInvalidRequest(res, 'Invalid vehicle ID.');
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return sendInvalidRequest(res, 'Request body must be an object.');
  }

  const fields = Object.keys(req.body);
  if (fields.length !== 1 || fields[0] !== 'verificationStatus') {
    return sendInvalidRequest(res, 'Only verificationStatus may be updated.');
  }

  const { verificationStatus } = req.body;
  const allowedStatuses = Object.values(VEHICLE_VERIFICATION_STATUSES);
  if (typeof verificationStatus !== 'string' || !allowedStatuses.includes(verificationStatus)) {
    return sendInvalidRequest(res, 'Invalid verification status.');
  }

  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.' },
      });
    }

    if (vehicle.verificationStatus !== VEHICLE_VERIFICATION_STATUSES.PENDING) {
      return sendInvalidRequest(res, 'Only pending vehicles can be reviewed.');
    }

    if (verificationStatus === VEHICLE_VERIFICATION_STATUSES.PENDING) {
      return sendInvalidRequest(res, 'Vehicle is already pending verification.');
    }

    vehicle.verificationStatus = verificationStatus;
    await vehicle.save();

    return res.status(200).json({ success: true, data: { vehicle } });
  } catch (error) {
    return handleVehicleError(error, res, next);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  getVehiclesForAdmin,
  updateVehicleVerification,
};
