const {
    loginController,
    signupController,
    refreshAccessTokenController,
    logoutController,
} = require('../../controllers/auth.controller');
const requireUser = require('../../middlewares/requireUser');
const router = require('express').Router();

// To signup/create a new account
router.post('/signup', signupController);

// To login into existing account
router.post('/login', loginController);

// To logout from an exiting logged in account
router.post('/logout', logoutController);

// To refresh the access token
router.get('/refresh', refreshAccessTokenController);

module.exports = router;
