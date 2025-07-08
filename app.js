// Temporary comment for PR difference

const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notes', require('./routes/note.routes'));

module.exports = app;
