const jwt = require('jsonwebtoken');

const env = require('./env');

const AUTH_COOKIE_NAME = 'vahana_auth';
const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const ensureJwtSecret = () => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is required for authentication.');
  }
};

const signAuthToken = (payload) => {
  ensureJwtSecret();

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const verifyAuthToken = (token) => {
  ensureJwtSecret();

  return jwt.verify(token, env.jwtSecret);
};

const authCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: AUTH_COOKIE_MAX_AGE,
};

const authCookieClearOptions = {
  httpOnly: authCookieOptions.httpOnly,
  secure: authCookieOptions.secure,
  sameSite: authCookieOptions.sameSite,
  path: authCookieOptions.path,
};

module.exports = {
  AUTH_COOKIE_NAME,
  authCookieClearOptions,
  authCookieOptions,
  signAuthToken,
  verifyAuthToken,
};
