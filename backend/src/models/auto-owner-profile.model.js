const mongoose = require('mongoose');

const User = require('./user.model');
const { USER_ROLES } = User;

const hasAutoOwnerRole = async (userId) => {
  const user = await User.exists({ _id: userId, role: USER_ROLES.AUTO_OWNER });

  return Boolean(user);
};

const autoOwnerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      validate: {
        validator: hasAutoOwnerRole,
        message: 'Auto owner profiles must belong to an AUTO_OWNER user.',
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit Indian PIN code.'],
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
);

const AutoOwnerProfile =
  mongoose.models.AutoOwnerProfile ||
  mongoose.model('AutoOwnerProfile', autoOwnerProfileSchema);

module.exports = AutoOwnerProfile;
