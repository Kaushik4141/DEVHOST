const express = require('express');
const { requireAuth } = require('@clerk/express');
const { me } = require('../controllers/auth.controller');
const { signup } = require('../controllers/auth.signup.controller');

const router = express.Router();

// Create initial user record for the authenticated Clerk user (idempotent via unique index)
router.post('/signup', requireAuth(), signup);
router.get('/me', me);

module.exports = router;
