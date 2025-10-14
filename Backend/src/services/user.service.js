const { User } = require('../models/User');

function extractClerkInfo(clerkUser) {
  const primaryEmail = clerkUser?.primaryEmailAddressId
    ? clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
    : clerkUser?.emailAddresses?.[0]?.emailAddress;
  const username = clerkUser?.username || clerkUser?.firstName || '';
  const domain = primaryEmail ? primaryEmail.split('@')[1] : undefined;
  return { primaryEmail, username, domain };
}

async function upsertFromClerk({ userId, clerkUser }) {
  const { primaryEmail, username, domain } = extractClerkInfo(clerkUser);
  const dbUser = await User.findOneAndUpdate(
    { clerkUserId: userId },
    {
      $setOnInsert: { clerkUserId: userId },
      $set: { email: primaryEmail, username, domain },
    },
    { new: true, upsert: true }
  );
  return { dbUser, primaryEmail, username };
}

async function getByClerkId(userId) {
  return User.findOne({ clerkUserId: userId });
}

async function updateProfile(userId, { username, domain }) {
  const update = {
    ...(username !== undefined && { username }),
    ...(domain !== undefined && { domain }),
  };
  return User.findOneAndUpdate({ clerkUserId: userId }, { $set: update }, { new: true });
}

async function createUser({ clerkUserId, email, username, domain }) {
  const existing = await User.findOne({ clerkUserId });
  if (existing) return null; // caller can handle conflict
  const user = new User({ clerkUserId, email, username, domain });
  return user.save();
}

module.exports = { upsertFromClerk, getByClerkId, updateProfile, createUser };
