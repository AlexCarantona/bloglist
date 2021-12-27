/* IMPORTS */
// Config variables
const config = require('./utils/config')

// Express
const express = require('express')
const app = express()
// Express middleware
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
// DB connection
const mongoose = require('mongoose');

// Helper logger
const logger = require('./utils/logger');


/* SERVER SETUP AND APP CREATION */
// DB connection management
logger.info("Connecting to remote MongoDB URI");

const MONGODB_URI = process.env.NODE_ENV === 'test'
? config.MONGODB_URI
: config.MONGODB_URI_TEST;

mongoose.connect(MONGODB_URI)
.then(success => logger.info("Succesfully connected to MongoDB remote."))
.catch(error => logger.error("Error connecting to remote MongoDB", error));

// Middleware to handle reqs and res.
app.use(cors());
app.use(express.json());

//Middleware to display information
app.use(middleware.requestLogger);

// Routing
app.use('/api/blogs/', blogsRouter);
app.use('/api/users', usersRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;
