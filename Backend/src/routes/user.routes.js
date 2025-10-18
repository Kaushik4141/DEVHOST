const express = require('express');
const { getProfile, putProfile,alive } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', putProfile);
router.get('/alive', alive);


module.exports = router;
