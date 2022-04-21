const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "34.122.236.108",
  PORT: process.env.PORT || 4000,
};