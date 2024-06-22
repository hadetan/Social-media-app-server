const mongoose = require('mongoose');
const config = require('./index');
const { ServerApiVersion } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async () => {
    const MONGO_URI = config.MONGO_URI;
    try {
        const connect = await mongoose.connect(MONGO_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
