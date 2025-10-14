const asyncHandler = require('../utils/asyncHandler');
const { clerkClient } = require('@clerk/express');
const { upsertFromClerk } = require('../services/user.service');

// Creates or updates the authenticated user's record in MongoDB.
// Relies on Clerk session; protected by requireAuth() at the route level.
const signup = asyncHandler(async (req, res) => {
  const { userId } = req.auth || {};
  if (!userId) return res.status(401).json({ error: 'Unauthenticated' });

  const clerkUser = await clerkClient.users.getUser(userId);

  // Optional: enforce a provider policy (e.g., Google only)
  // const usesGoogle = clerkUser?.externalAccounts?.some((a) => a.provider === 'oauth_google');
  // if (!usesGoogle) return res.status(403).json({ error: 'Only Google OAuth sign-ins are allowed' });

  const { dbUser, primaryEmail, username } = await upsertFromClerk({ userId, clerkUser });

  return res.status(201).json({
    clerk: { id: clerkUser.id, email: primaryEmail, username },
    profile: dbUser,
  });
});

module.exports = { signup };
