const jwt = require('jsonwebtoken');
const configs = require('../configs');
const { customError } = require('../utils/responseWrapper');
const User = require('../models/User.schema');

module.exports = async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
    ) {
        return res.send(customError(401, 'Authorization header is required'));
    }

    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, configs.JWT_ACCESS_KEY);
        req._id = decoded._id;

        const user = await User.findById(req._id);
        if (!user) {
            return res.send(customError(404, 'User not found'));
        }

        next();
    } catch (error) {
        console.log(error);
        return res.send(customError(401, 'Invalid access key'));
    }
};
