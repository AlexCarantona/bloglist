const logger = require('./logger.js');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  logger.info('---');
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')){
    req.token = authorization.substring(7)
  };
  next()
};

const userExtractor = (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    req.user = decodedToken;
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'malformatted id'
    })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message})
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token -- Forbidden operation'
    })
  }
  next(error);
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint'})
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}
