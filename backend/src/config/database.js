const mongoose = require('mongoose');

const connectDatabase = async (mongodbUri) => {
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is required to connect to MongoDB.');
  }

  await mongoose.connect(mongodbUri);
};

module.exports = connectDatabase;
