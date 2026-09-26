const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const errorHandler = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', healthRoutes);

if (env.nodeEnv !== 'production') {
  app.use('/api/v1/test', testRoutes);
}

app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;
