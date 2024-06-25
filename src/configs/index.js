const dotenv = require('dotenv');

dotenv.config();

module.exports = configs = {
    PORT: process.env.PORT || 4001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
    JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
};
