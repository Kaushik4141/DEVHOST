'use client';

import { useTrendingHashtags } from '@/hooks/useCommunity';
import { TrendingUp, Hash, Loader2, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/UI/button';
import type { TrendingHashtag } from '@/types/Community';

export default function TrendingTopics() {
  const { trendingHashtags, timeRange, generatedAt, isLoading, error, mutate } = useTrendingHashtags();

  const handleHashtagClick = (hashtag: TrendingHashtag) => {
    // You could implement hashtag filtering or navigation here
    console.log('Navigate to hashtag:', hashtag.name);
  };

  const handleRefresh = async () => {
    await mutate();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Trending Topics
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Loading trends...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Trending Topics
          </h2>
          <Button onClick={handleRefresh} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Failed to load trending topics</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in opacity-0 translate-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded mr-2"></span>
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500 animate-pulse" />
          Trending Topics
        </h2>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {trendingHashtags.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No trending topics right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trendingHashtags.map((hashtag, index) => (
            <div
              key={hashtag.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 cursor-pointer transition-all duration-300 group"
              onClick={() => handleHashtagClick(hashtag)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full shadow-sm group-hover:shadow transition-shadow duration-300">
                  <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <Hash className="h-4 w-4 text-blue-500 group-hover:text-indigo-500 transition-colors duration-300" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {hashtag.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {hashtag.count} {hashtag.count === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Trending</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Based on posts from the last {timeRange}
        </p>
        {generatedAt && (
          <p className="text-xs text-gray-400 text-center mt-1">
            Updated {new Date(generatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
