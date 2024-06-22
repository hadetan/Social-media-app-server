const config = require('../configs');
const asyncHandler = require('../utils/asyncHandler');
const customError = require('../utils/customError');
const jwt = require('jsonwebtoken');

module.exports = asyncHandler(async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
    ) {
        throw new customError('Authorization header required', 401);
    }

    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, config.JWT_ACCESS_KEY);
        req._id = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        throw new customError('Invalid access key', 500);
    }

    next();
});
