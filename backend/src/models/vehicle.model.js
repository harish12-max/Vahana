const mongoose = require('mongoose');

const VEHICLE_VERIFICATION_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

const normalizeRegistrationNumber = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/[\s-]/g, '').toUpperCase();
};

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AutoOwnerProfile',
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: normalizeRegistrationNumber,
      match: [
        /^[A-Z0-9]{6,15}$/,
        'Please provide a valid vehicle registration number.',
      ],
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    ownershipInformation: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: Object.values(VEHICLE_VERIFICATION_STATUSES),
      default: VEHICLE_VERIFICATION_STATUSES.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
module.exports.VEHICLE_VERIFICATION_STATUSES = VEHICLE_VERIFICATION_STATUSES;
