const app = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`Vahana API is running on port ${env.port} in ${env.nodeEnv} mode.`);
    });
  } catch (error) {
    console.error(`Failed to start Vahana API: ${error.message}`);
    process.exit(1);
  }
};

startServer();
