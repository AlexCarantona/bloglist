require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST;

module.exports = {
  MONGODB_URI,
  MONGODB_URI_TEST,
  PORT
}
