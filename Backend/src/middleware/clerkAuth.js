const { verifyToken } = require('@clerk/clerk-sdk-node');
const { User } = require('../models/User');
const { env } = require('../config/env');

/**
 * Clerk authentication middleware that verifies session tokens
 * and performs get-or-create user operations
 */
const clerkAuth = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No valid authorization token provided'
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Clerk
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY
    });

    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const clerkId = payload.sub;

    // Get or create user in our database
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Create new user with Clerk profile information
      const userData = {
        clerkId,
        email: payload.email || null,
        username: payload.username || payload.name || `user_${clerkId.slice(-8)}`,
        avatarUrl: payload.picture || null
      };

      user = new User(userData);
      await user.save();
    } else {
      // Update existing user with latest Clerk data if needed
      const updateData = {};
      
      if (payload.email && user.email !== payload.email) {
        updateData.email = payload.email;
      }
      if (payload.username && user.username !== payload.username) {
        updateData.username = payload.username;
      }
      if (payload.picture && user.avatarUrl !== payload.picture) {
        updateData.avatarUrl = payload.picture;
      }

      if (Object.keys(updateData).length > 0) {
        user = await User.findByIdAndUpdate(
          user._id,
          updateData,
          { new: true }
        );
      }
    }

    // Attach the MongoDB user object to the request
    req.user = user;
    req.clerkId = clerkId;

    next();
  } catch (error) {
    console.error('Clerk auth middleware error:', error);
    
    if (error.name === 'ClerkAPIError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

module.exports = clerkAuth;
