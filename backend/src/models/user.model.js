const mongoose = require('mongoose');

const USER_ROLES = ['ADVERTISER', 'AUTO_OWNER', 'ADMIN'];
const ACCOUNT_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, 'Please provide a valid mobile number.'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: USER_ROLES,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: 'PENDING',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
