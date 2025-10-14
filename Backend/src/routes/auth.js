const express = require('express');
const { requireAuth, clerkClient } = require('@clerk/express');
const { User } = require('../models/User');

const router = express.Router();

// Returns current authenticated user from Clerk and ensures a DB record exists.
router.get('/me', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

    // Fetch Clerk user
    const clerkUser = await clerkClient.users.getUser(userId);

    // Enforce Google OAuth only
    const usesGoogle = clerkUser?.externalAccounts?.some((a) => a.provider === 'oauth_google');
    if (!usesGoogle) {
      return res.status(403).json({ error: 'Only Google OAuth sign-ins are allowed' });
    }

    // Extract email, username, domain
    const primaryEmail = clerkUser?.primaryEmailAddressId
      ? clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
      : clerkUser?.emailAddresses?.[0]?.emailAddress;
    const username = clerkUser?.username || clerkUser?.firstName || '';
    const domain = primaryEmail ? primaryEmail.split('@')[1] : undefined;

    // Upsert user in MongoDB
    const dbUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        $setOnInsert: {
          clerkUserId: userId,
        },
        $set: {
          email: primaryEmail,
          username,
          domain,
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      auth: req.auth,
      clerk: {
        id: clerkUser.id,
        email: primaryEmail,
        username,
      },
      profile: dbUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
