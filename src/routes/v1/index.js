const router = require('express').Router();
const authRoutes = require('./auth.routes.js');
const postRouter = require('./post.routes.js');

router.use('/auth', authRoutes);
router.use('/post', postRouter);

module.exports = router;
