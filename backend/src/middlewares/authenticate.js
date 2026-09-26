const { AUTH_COOKIE_NAME, verifyAuthToken } = require('../config/auth');

const authenticate = (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication is required.' },
    });
  }

  try {
    const payload = verifyAuthToken(token);

    req.auth = {
      userId: payload.userId,
      role: payload.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication token is invalid or expired.' },
    });
  }
};

module.exports = authenticate;
