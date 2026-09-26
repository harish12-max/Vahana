const bcrypt = require('bcryptjs');

const {
  AUTH_COOKIE_NAME,
  authCookieClearOptions,
  authCookieOptions,
  signAuthToken,
} = require('../config/auth');
const User = require('../models/user.model');
const { USER_ROLES } = User;

const PUBLIC_REGISTRATION_ROLES = [USER_ROLES.ADVERTISER, USER_ROLES.AUTO_OWNER];

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  mobileNumber: user.mobileNumber,
  role: user.role,
  accountStatus: user.accountStatus,
  isEmailVerified: user.isEmailVerified,
  isMobileVerified: user.isMobileVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password, role } = req.body;

    if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid registration role.' },
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 8 characters long.' },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, mobileNumber, passwordHash, role });

    return res.status(201).json({
      success: true,
      data: { user: toSafeUser(user) },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid registration data.' },
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with the provided details already exists.' },
      });
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required.' },
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' },
      });
    }

    const token = signAuthToken({ userId: user._id.toString(), role: user.role });

    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    return res.status(200).json({
      success: true,
      data: { user: toSafeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieClearOptions);

  res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully.' },
  });
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication is required.' },
      });
    }

    return res.status(200).json({
      success: true,
      data: { user: toSafeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCurrentUser,
  login,
  logout,
  register,
};
