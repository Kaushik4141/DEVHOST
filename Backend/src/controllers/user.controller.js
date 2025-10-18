const { requireAuth } = require('@clerk/express');
const asyncHandler = require('../utils/asyncHandler');
const { getByClerkId, updateProfile } = require('../services/user.service');

const getProfile = [
  requireAuth(),
  asyncHandler(async (req, res) => {
    const { userId } = req.auth;
    const user = await getByClerkId(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }),
];

const putProfile = [
  requireAuth(),
  asyncHandler(async (req, res) => {
    const { userId } = req.auth;
    const { username, domain } = req.body || {};
    const user = await updateProfile(userId, { username, domain });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }),
];
const alive = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is alive!' });
});
module.exports = { getProfile, putProfile, alive };
