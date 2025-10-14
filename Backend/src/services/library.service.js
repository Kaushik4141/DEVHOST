const axios = require('axios');
const { Library } = require('../models/Library');
const { env } = require('../config/env');

/**
 * Service for fetching and storing library data from libraries.io
 */
class LibraryService {
  /**
   * Fetch trending libraries from libraries.io and store in MongoDB
   */
  static async fetchAndStoreTrendingLibraries() {
    try {
      console.log('[library service] Fetching trending libraries');
      
      // Get API key from environment variable
      const apiKey = env.LIBRARIES_IO_API_KEY;
      
      if (!apiKey) {
        console.error('[library service] LIBRARIES_IO_API_KEY is not defined in environment variables');
        return;
      }

      // Fetch trending libraries from libraries.io API
      const response = await axios.get(
        `https://libraries.io/api/search?sort=stars&per_page=8&api_key=${apiKey}`
      );

      if (response.status !== 200) {
        console.error('[library service] Error fetching trending libraries:', response.statusText);
        return;
      }

      const libraries = response.data;

      // Delete previous trending libraries
      await Library.deleteMany({ type: 'trending' });

      // Store new trending libraries
      const libraryDocs = libraries.map(library => ({
        ...library,
        type: 'trending',
        fetched_at: new Date()
      }));

      await Library.insertMany(libraryDocs);
      console.log(`[library service] Stored ${libraryDocs.length} trending libraries`);
    } catch (error) {
      console.error('[library service] Error in fetchAndStoreTrendingLibraries:', error);
    }
  }

  /**
   * Fetch recent libraries from libraries.io and store in MongoDB
   */
  static async fetchAndStoreRecentLibraries() {
    try {
      console.log('[library service] Fetching recent libraries');
      
      // Get API key from environment variable
      const apiKey = env.LIBRARIES_IO_API_KEY;
      
      if (!apiKey) {
        console.error('[library service] LIBRARIES_IO_API_KEY is not defined in environment variables');
        return;
      }

      // Fetch recent libraries from libraries.io API
      const response = await axios.get(
        `https://libraries.io/api/search?sort=created_at&per_page=8&api_key=${apiKey}`
      );

      if (response.status !== 200) {
        console.error('[library service] Error fetching recent libraries:', response.statusText);
        return;
      }

      const libraries = response.data;

      // Delete previous recent libraries
      await Library.deleteMany({ type: 'recent' });

      // Store new recent libraries
      const libraryDocs = libraries.map(library => ({
        ...library,
        type: 'recent',
        fetched_at: new Date()
      }));

      await Library.insertMany(libraryDocs);
      console.log(`[library service] Stored ${libraryDocs.length} recent libraries`);
    } catch (error) {
      console.error('[library service] Error in fetchAndStoreRecentLibraries:', error);
    }
  }

  /**
   * Get trending libraries from MongoDB
   */
  static async getTrendingLibraries() {
    try {
      const libraries = await Library.find({ type: 'trending' })
        .sort({ fetched_at: -1 })
        .limit(8);
      return libraries;
    } catch (error) {
      console.error('[library service] Error in getTrendingLibraries:', error);
      throw error;
    }
  }

  /**
   * Get recent libraries from MongoDB
   */
  static async getRecentLibraries() {
    try {
      const libraries = await Library.find({ type: 'recent' })
        .sort({ fetched_at: -1 })
        .limit(8);
      return libraries;
    } catch (error) {
      console.error('[library service] Error in getRecentLibraries:', error);
      throw error;
    }
  }
}

module.exports = LibraryService;