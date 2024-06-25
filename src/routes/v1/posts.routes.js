const router = require('express').Router();
const {
    createPostController,
    likeAndUnlikePostController,
    updatePostController,
    deletePostController,
} = require('../../controllers/posts.controller');
const requireUser = require('../../middlewares/requireUser');

// To create a post
router.post('/', requireUser, createPostController);

// To update/edit a post
router.put('/', requireUser, updatePostController);

// To delete/remove a post
router.delete('/', requireUser, deletePostController);

// To like or unlike a post
router.post('/like', requireUser, likeAndUnlikePostController);

module.exports = router;
