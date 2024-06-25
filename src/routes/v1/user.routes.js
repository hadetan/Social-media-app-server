const {
    followOrUnfollowUserController,
    getPostsOfFollowing,
} = require('../../controllers/user.controller');
const requireUser = require('../../middlewares/requireUser');

const router = require('express').Router();

// To follow or unfollow a user
router.post('/follow', requireUser, followOrUnfollowUserController);

// To get all posts whom we have followed
router.get('/getPostsOfFollowing', requireUser, getPostsOfFollowing);

module.exports = router;
