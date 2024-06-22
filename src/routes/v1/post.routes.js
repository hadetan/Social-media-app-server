const router = require('express').Router();
const { getAllPosts } = require('../../controllers/posts.controller');
const requireUser = require('../../middleware/requireUser')

router.get('/all', requireUser, getAllPosts);

module.exports = router;
