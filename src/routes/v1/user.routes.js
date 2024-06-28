const {
    followOrUnfollowUserController,
    getPostsOfFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateUserProfile,
    getUserProfile,
} = require('../../controllers/user.controller');
const requireUser = require('../../middlewares/requireUser');

const router = require('express').Router();

// To follow or unfollow a user
router.post('/follow', requireUser, followOrUnfollowUserController);

// To get all posts whom we have followed
router.get('/getPostsOfFollowing', requireUser, getPostsOfFollowing);

// To get my all posts
router.get('/getMyPosts', requireUser, getMyPosts);

// To get all my profile data
router.get('/getMyInfo', requireUser, getMyInfo);

// To get all posts from a certain user
router.get('/getUserPosts', requireUser, getUserPosts);

// To get a user profile
router.post('/getUserProfile', requireUser, getUserProfile);

// To update my profile
router.put('/', requireUser, updateUserProfile);

// To delete user account
router.delete('/', requireUser, deleteMyProfile);

module.exports = router;
