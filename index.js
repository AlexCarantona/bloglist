// Server
const http = require('http')

// App
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')

// Utils
const logger = require('./utils/logger') // Logging.
const config = require('./utils/config') // Configuration.


// Server setup
const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
