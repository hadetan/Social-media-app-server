const dotenv = require('dotenv');

dotenv.config();

module.exports = configs = {
    //PORT
    PORT: process.env.PORT || 4001,

    //Database URI
    MONGO_URI: process.env.MONGO_URI,

    //JasonWebToken srecret keys
    JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
    JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,

    //CLoudinary API configuration keys
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
};
