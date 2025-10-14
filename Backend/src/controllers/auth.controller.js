const { requireAuth, clerkClient } = require('@clerk/express');
const asyncHandler = require('../utils/asyncHandler');
const { upsertFromClerk } = require('../services/user.service');

const me = [
  requireAuth(),
  asyncHandler(async (req, res) => {
    const { userId } = req.auth;
    const clerkUser = await clerkClient.users.getUser(userId);

    // Enforce Google OAuth only
    const usesGoogle = clerkUser?.externalAccounts?.some((a) => a.provider === 'oauth_google');
    if (!usesGoogle) {
      return res.status(403).json({ error: 'Only Google OAuth sign-ins are allowed' });
    }

    const { dbUser, primaryEmail, username } = await upsertFromClerk({ userId, clerkUser });

    res.json({
      auth: req.auth,
      clerk: {
        id: clerkUser.id,
        email: primaryEmail,
        username,
      },
      profile: dbUser,
    });
  }),
];

module.exports = { me };
