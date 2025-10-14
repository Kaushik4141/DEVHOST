const express = require('express');
const { getProfile, putProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', putProfile);

module.exports = router;
