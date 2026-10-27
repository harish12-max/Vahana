require('dotenv').config();

const env = {
  port: Number(process.env.PORT) || 5001,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrls: (process.env.FRONTEND_URLS || 'http://localhost:5174')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

if (
  env.cloudinaryCloudName &&
  env.cloudinaryApiKey &&
  env.cloudinaryApiSecret
) {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

module.exports = env;
