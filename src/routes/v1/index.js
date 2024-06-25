const router = require('express').Router();
const auth = require('./auth.routes');
const postsRouter = require('./posts.routes');
const userRouter = require('./user.routes');

router.use('/auth', auth);
router.use('/posts', postsRouter);
router.use('/user', userRouter);

module.exports = router;
