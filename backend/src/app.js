const cors = require('cors');
const express = require('express');

const errorHandler = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', healthRoutes);
app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;
