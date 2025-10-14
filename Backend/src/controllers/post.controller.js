const { Post } = require('../models/Post');
const { Hashtag } = require('../models/Hashtag');
const { User } = require('../models/User');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new post
 * POST /api/posts
 */
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const authorId = req.user._id;

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, 'Post content is required');
  }

  if (content.length > 280) {
    throw new ApiError(400, 'Post content cannot exceed 280 characters');
  }

  // Extract hashtags from content (words starting with #)
  const hashtagMatches = content.match(/#[a-zA-Z0-9_]+/g) || [];
  const hashtagNames = hashtagMatches.map(tag => tag.substring(1).toLowerCase());

  // Upsert hashtags and get their ObjectIds
  const hashtagIds = [];
  for (const hashtagName of hashtagNames) {
    const hashtag = await Hashtag.findOneAndUpdate(
      { name: hashtagName },
      { name: hashtagName },
      { upsert: true, new: true }
    );
    hashtagIds.push(hashtag._id);
  }

  // Create the post
  const post = new Post({
    content: content.trim(),
    author: authorId,
    hashtags: hashtagIds
  });

  await post.save();

  // Populate the post with author and hashtag details
  await post.populate([
    { path: 'author', select: 'username avatarUrl' },
    { path: 'hashtags', select: 'name' }
  ]);

  res.status(201).json(
    new ApiResponse(201, post, 'Post created successfully')
  );
});

/**
 * Get paginated list of posts
 * GET /api/posts
 */
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 50) {
    throw new ApiError(400, 'Invalid pagination parameters');
  }

  // Get posts with pagination
  const posts = await Post.find()
    .populate('author', 'username avatarUrl')
    .populate('hashtags', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const totalPosts = await Post.countDocuments();

  // Calculate pagination info
  const totalPages = Math.ceil(totalPosts / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json(
    new ApiResponse(200, {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage,
        hasPrevPage,
        limit
      }
    }, 'Posts retrieved successfully')
  );
});

/**
 * Toggle like on a post
 * POST /api/posts/:id/like
 */
const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ApiError(400, 'Invalid post ID');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Remove like
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
  } else {
    // Add like
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  // Get updated post with like count
  const updatedPost = await Post.findById(postId)
    .populate('author', 'username avatarUrl')
    .populate('hashtags', 'name')
    .lean();

  res.json(
    new ApiResponse(200, {
      post: updatedPost,
      liked: !isLiked,
      likeCount: updatedPost.likes.length
    }, isLiked ? 'Like removed' : 'Post liked')
  );
});

module.exports = {
  createPost,
  getPosts,
  toggleLike
};
