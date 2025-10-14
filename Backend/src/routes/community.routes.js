const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');
const {
  createPost,
  getPosts,
  toggleLike
} = require('../controllers/post.controller');
const {
  getTrendingHashtags
} = require('../controllers/trending.controller');

// Posts routes
router.route('/posts')
  .get(getPosts) // Public route - no auth required
  .post(clerkAuth, createPost); // Protected route - requires auth

router.route('/posts/:id/like')
  .post(clerkAuth, toggleLike); // Protected route - requires auth

// Trending topics route
router.route('/trending')
  .get(getTrendingHashtags); // Public route - no auth required

module.exports = router;
