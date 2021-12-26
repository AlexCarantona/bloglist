const logger = require('./logger.js');

const requestLogger = (req, res, next) => {
  logger.info('---');
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  logger.info('---');
  next();
}

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message})
  }

  next(error);
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint'})
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint
}
