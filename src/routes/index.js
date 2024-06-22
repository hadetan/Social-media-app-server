const router = require('express').Router();
const v1Routes = require('./v1/index.js');

router.use('/v1', v1Routes);

module.exports = router;
