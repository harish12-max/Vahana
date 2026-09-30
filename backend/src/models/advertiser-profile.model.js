const mongoose = require('mongoose');

const User = require('./user.model');
const { USER_ROLES } = User;

const hasAdvertiserRole = async (userId) => {
  const user = await User.exists({ _id: userId, role: USER_ROLES.ADVERTISER });

  return Boolean(user);
};

const advertiserProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      validate: {
        validator: hasAdvertiserRole,
        message: 'Advertiser profiles must belong to an ADVERTISER user.',
      },
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    businessType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    businessAddress: {
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
  },
  {
    timestamps: true,
  },
);

const AdvertiserProfile =
  mongoose.models.AdvertiserProfile ||
  mongoose.model('AdvertiserProfile', advertiserProfileSchema);

module.exports = AdvertiserProfile;
