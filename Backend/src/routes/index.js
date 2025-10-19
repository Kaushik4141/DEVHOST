const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/ingest', require('./ingest.routes'));
router.use('/library', require('./library.routes'));
router.use('/api', require('./dsa.routes'));
router.use('/api', require('./community.routes'));


module.exports = router;
