const cron = require('node-cron');
const LibraryService = require('./library.service');

/**
 * Service for scheduling tasks
 */
class SchedulerService {
  /**
   * Initialize all scheduled tasks
   */
  static initScheduledTasks() {
    console.log('[scheduler] Initializing scheduled tasks');
    
    // Schedule library data fetching every hour
    // Cron format: second(0-59) minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-6)
    cron.schedule('0 0 * * * *', async () => {
      console.log('[scheduler] Running hourly library data fetch');
      await LibraryService.fetchAndStoreTrendingLibraries();
      await LibraryService.fetchAndStoreRecentLibraries();
    });

    // Run immediately on startup
    this.runInitialFetch();
  }

  /**
   * Run initial fetch on startup
   */
  static async runInitialFetch() {
    console.log('[scheduler] Running initial library data fetch');
    try {
      await LibraryService.fetchAndStoreTrendingLibraries();
      await LibraryService.fetchAndStoreRecentLibraries();
    } catch (error) {
      console.error('[scheduler] Error in initial fetch:', error);
    }
  }
}

module.exports = SchedulerService;