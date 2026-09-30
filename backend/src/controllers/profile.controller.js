const AdvertiserProfile = require('../models/advertiser-profile.model');
const AutoOwnerProfile = require('../models/auto-owner-profile.model');

const advertiserFields = [
  'businessName',
  'businessType',
  'businessAddress',
  'city',
  'locality',
  'pincode',
];
const autoOwnerFields = ['address', 'city', 'locality', 'pincode'];

const sendInvalidRequest = (res, message) =>
  res.status(400).json({
    success: false,
    error: { message },
  });

const validateProfilePayload = (body, allowedFields, requireAllFields) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be an object.';
  }

  const suppliedFields = Object.keys(body);
  const invalidField = suppliedFields.find((field) => !allowedFields.includes(field));

  if (invalidField) {
    return `Field is not allowed: ${invalidField}.`;
  }

  if (requireAllFields) {
    const missingField = allowedFields.find((field) => body[field] === undefined);

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

const pickFields = (body, allowedFields) =>
  allowedFields.reduce((profileFields, field) => {
    if (body[field] !== undefined) {
      profileFields[field] = body[field];
    }

    return profileFields;
  }, {});

const handleProfileError = (error, res, next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return sendInvalidRequest(res, 'Invalid profile data.');
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      error: { message: 'A profile already exists for this user.' },
    });
  }

  return next(error);
};

const createAdvertiserProfile = async (req, res, next) => {
  const validationError = validateProfilePayload(req.body, advertiserFields, true);

  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  try {
    const existingProfile = await AdvertiserProfile.exists({ user: req.auth.userId });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: { message: 'A profile already exists for this user.' },
      });
    }

    const profile = await AdvertiserProfile.create({
      user: req.auth.userId,
      ...pickFields(req.body, advertiserFields),
    });

    return res.status(201).json({ success: true, data: { profile } });
  } catch (error) {
    return handleProfileError(error, res, next);
  }
};

const getAdvertiserProfile = async (req, res, next) => {
  try {
    const profile = await AdvertiserProfile.findOne({ user: req.auth.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'Advertiser profile not found.' },
      });
    }

    return res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    return next(error);
  }
};

const updateAdvertiserProfile = async (req, res, next) => {
  const validationError = validateProfilePayload(req.body, advertiserFields, false);

  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  const updates = pickFields(req.body, advertiserFields);
  if (Object.keys(updates).length === 0) {
    return sendInvalidRequest(res, 'At least one profile field is required.');
  }

  try {
    const profile = await AdvertiserProfile.findOne({ user: req.auth.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'Advertiser profile not found.' },
      });
    }

    Object.assign(profile, updates);
    await profile.save();

    return res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    return handleProfileError(error, res, next);
  }
};

const createAutoOwnerProfile = async (req, res, next) => {
  const validationError = validateProfilePayload(req.body, autoOwnerFields, true);

  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  try {
    const existingProfile = await AutoOwnerProfile.exists({ user: req.auth.userId });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: { message: 'A profile already exists for this user.' },
      });
    }

    const profile = await AutoOwnerProfile.create({
      user: req.auth.userId,
      ...pickFields(req.body, autoOwnerFields),
    });

    return res.status(201).json({ success: true, data: { profile } });
  } catch (error) {
    return handleProfileError(error, res, next);
  }
};

const getAutoOwnerProfile = async (req, res, next) => {
  try {
    const profile = await AutoOwnerProfile.findOne({ user: req.auth.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'Auto owner profile not found.' },
      });
    }

    return res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    return next(error);
  }
};

const updateAutoOwnerProfile = async (req, res, next) => {
  const validationError = validateProfilePayload(req.body, autoOwnerFields, false);

  if (validationError) {
    return sendInvalidRequest(res, validationError);
  }

  const updates = pickFields(req.body, autoOwnerFields);
  if (Object.keys(updates).length === 0) {
    return sendInvalidRequest(res, 'At least one profile field is required.');
  }

  try {
    const profile = await AutoOwnerProfile.findOne({ user: req.auth.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'Auto owner profile not found.' },
      });
    }

    Object.assign(profile, updates);
    await profile.save();

    return res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    return handleProfileError(error, res, next);
  }
};

module.exports = {
  createAdvertiserProfile,
  getAdvertiserProfile,
  updateAdvertiserProfile,
  createAutoOwnerProfile,
  getAutoOwnerProfile,
  updateAutoOwnerProfile,
};
