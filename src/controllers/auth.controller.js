const User = require('../models/User.schema');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');
const config = require('../configs');

const signupController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError('Email and Password are required', 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new customError('User already exists', 409);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: encryptedPassword,
    });

    return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user,
    });
});

const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError('Email and Password are required', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new customError('User does not exists', 409);
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        throw new customError('Incorrect password', 403);
    }

    const accessToken = generateAccessToken({
        _id: user._id,
    });

    const refreshToken = generateRefreshToken({
        _id: user._id,
    });

    return res.status(202).json({
        success: true,
        message: 'Logged in successfully',
        accessToken,
        refreshToken,
    });
});

// This api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if(!refreshToken) {
        throw new customError('Refresh token is required', 401 )
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_KEY);

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.status(201).json({
            accessToken,
        });
    } catch (error) {
        console.log(error);
        throw new customError('Invalid refresh token', 401);
    }
});

// Internal functions
const generateAccessToken = (data) => {
    const token = jwt.sign(data, config.JWT_ACCESS_KEY, {
        expiresIn: '15m',
    });
    return token;
};

const generateRefreshToken = (data) => {
    const token = jwt.sign(data, config.JWT_REFRESH_KEY, {
        expiresIn: '1y',
    });
    return token;
};

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
};
