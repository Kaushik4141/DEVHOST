const express = require('express');
const { requireAuth } = require('@clerk/express');
const { User } = require('../models/User');

const router = express.Router();

// Get current user's profile from DB
router.get('/profile', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update current user's profile (username, domain)
router.put('/profile', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const { username, domain } = req.body || {};
    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: { ...(username !== undefined && { username }), ...(domain !== undefined && { domain }) } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
