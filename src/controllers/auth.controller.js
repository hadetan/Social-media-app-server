const User = require('../models/User.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configs = require('../configs');
const { customError, success } = require('../utils/responseWrapper');

const signupController = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.send(
                customError(400, 'Email, Password and Name are required')
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send(customError(409, 'User already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        return res.send(success(201, 'User created successfully'));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(
                customError(400, 'Email and Password are required')
            );
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.send(customError(404, 'User does not exists'));
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.send(customError(403, 'Incorrect password'));
        }

        const accessToken = generateAccessToken({
            _id: user._id,
        });

        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, { accessToken, refreshToken }));

        // return res.json({ accessToken });
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

// This API will check the refreshToken's validity and generate new access token
const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.send(
            customError(401, 'Refresh token in cookie is required')
        );
    }

    const refreshToken = cookies.jwt;

    console.log('refresh', refreshToken);

    try {
        const decoded = jwt.verify(refreshToken, configs.JWT_REFRESH_KEY);
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken }));
    } catch (error) {
        console.log(error);
        return res.send(customError(401, 'Invalid refresh token'));
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })

        return res.send(success(200, 'User logged out'))
    } catch (error) {
        return res.send(customError(500, error.message))
    }
}

// Internal functions
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, configs.JWT_ACCESS_KEY, {
            expiresIn: '1d',
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, configs.JWT_REFRESH_KEY, {
            expiresIn: '1y',
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
};
