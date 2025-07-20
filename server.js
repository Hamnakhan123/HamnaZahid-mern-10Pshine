const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');
const Note = require('./models/Note');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected...');
    await sequelize.sync(); // or { force: true } if you want to drop tables and recreate
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Unable to connect to DB:', err);
  }
})();
