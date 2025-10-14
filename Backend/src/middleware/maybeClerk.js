const { env } = require('../config/env');
const { clerkMiddleware } = require('@clerk/express');

module.exports = function maybeClerk() {
  const hasKeys = !!(env.CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY);
  if (!hasKeys) {
    return (req, res, next) => next();
  }
  return clerkMiddleware();
};
