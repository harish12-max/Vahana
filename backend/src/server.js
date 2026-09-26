const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Vahana API is running on port ${env.port} in ${env.nodeEnv} mode.`);
});
