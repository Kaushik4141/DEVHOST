const express = require('express');
const LibraryService = require('../services/library.service');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

/**
 * @route GET /library/trending
 * @desc Get trending libraries
 * @access Public
 */
router.get(
  '/trending',
  asyncHandler(async (req, res) => {
    const libraries = await LibraryService.getTrendingLibraries();
    return res.json(
      new ApiResponse(200, libraries, 'Trending libraries fetched successfully')
    );
  })
);

/**
 * @route GET /library/recent
 * @desc Get recent libraries
 * @access Public
 */
router.get(
  '/recent',
  asyncHandler(async (req, res) => {
    const libraries = await LibraryService.getRecentLibraries();
    return res.json(
      new ApiResponse(200, libraries, 'Recent libraries fetched successfully')
    );
  })
);

/**
 * @route POST /library/refresh
 * @desc Manually refresh library data
 * @access Public
 */
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    await LibraryService.fetchAndStoreTrendingLibraries();
    await LibraryService.fetchAndStoreRecentLibraries();
    return res.json(
      new ApiResponse(200, {}, 'Library data refreshed successfully')
    );
  })
);

module.exports = router;