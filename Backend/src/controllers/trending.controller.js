const { Post } = require('../models/Post');
const { Hashtag } = require('../models/Hashtag');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get trending hashtags based on usage in the last 48 hours
 * GET /api/trending
 */
const getTrendingHashtags = asyncHandler(async (req, res) => {
  // Calculate date 48 hours ago
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // MongoDB aggregation pipeline to get trending hashtags
  const trendingHashtags = await Post.aggregate([
    // Match posts created in the last 48 hours
    {
      $match: {
        createdAt: { $gte: fortyEightHoursAgo }
      }
    },
    // Unwind hashtags array to work with individual hashtags
    {
      $unwind: '$hashtags'
    },
    // Group by hashtag and count occurrences
    {
      $group: {
        _id: '$hashtags',
        count: { $sum: 1 },
        latestPost: { $max: '$createdAt' }
      }
    },
    // Lookup hashtag details
    {
      $lookup: {
        from: 'hashtags',
        localField: '_id',
        foreignField: '_id',
        as: 'hashtag'
      }
    },
    // Unwind hashtag array
    {
      $unwind: '$hashtag'
    },
    // Project the required fields
    {
      $project: {
        _id: 1,
        name: '$hashtag.name',
        count: 1,
        latestPost: 1
      }
    },
    // Sort by count (descending) and then by latest post (descending)
    {
      $sort: {
        count: -1,
        latestPost: -1
      }
    },
    // Limit to top 10
    {
      $limit: 10
    }
  ]);

  // Format the response
  const formattedTrending = trendingHashtags.map(item => ({
    id: item._id,
    name: item.name,
    count: item.count,
    latestPost: item.latestPost
  }));

  res.json(
    new ApiResponse(200, {
      trendingHashtags: formattedTrending,
      timeRange: '48 hours',
      generatedAt: new Date()
    }, 'Trending hashtags retrieved successfully')
  );
});

module.exports = {
  getTrendingHashtags
};
