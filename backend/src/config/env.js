require('dotenv').config();

const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrls: (process.env.FRONTEND_URLS || 'http://localhost:5174')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};

module.exports = env;
