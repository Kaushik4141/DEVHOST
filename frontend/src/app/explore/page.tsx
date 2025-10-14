'use client';

import React from 'react';
import useSWR from 'swr';
import LibraryCard from '@/components/LibraryCard';
import { Library, LibrariesResponse } from '@/types/Library';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Explore page component that displays trending and recent libraries
 */
export default function ExplorePage() {
  // Fetch trending libraries
  const { data: trendingData, error: trendingError, isLoading: trendingLoading } = 
    useSWR<LibrariesResponse>('/api/libraries/trending', fetcher);

  // Fetch recent libraries
  const { data: recentData, error: recentError, isLoading: recentLoading } = 
    useSWR<LibrariesResponse>('/api/libraries/recent', fetcher);

  // Determine if any section is loading
  const isLoading = trendingLoading || recentLoading;
  
  // Determine if any section has an error
  const hasError = trendingError || recentError || trendingData?.error || recentData?.error;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Main Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
          Explore Libraries & Frameworks
        </h1>
        <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Discover trending open-source libraries and recently added frameworks to power your next project
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 text-lg">Loading amazing libraries...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="bg-red-900/30 border border-red-700 text-red-100 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="font-semibold text-lg">Error loading libraries</p>
          </div>
          <p className="text-sm opacity-90">
            {trendingError?.message || recentError?.message || trendingData?.error || recentData?.error || 'An unknown error occurred'}
          </p>
          <p className="text-sm mt-2 opacity-80">
            Please check your API key configuration or try again later.
          </p>
        </div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !hasError && (
        <div className="space-y-20">
          {/* Trending Libraries Section */}
          <section className="relative">
            <div className="flex items-center mb-10">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    Trending Now
                  </h2>
                  <p className="text-gray-400 text-lg mt-2">Most popular libraries this week</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingData?.libraries?.map((library: Library) => (
                <LibraryCard key={`${library.name}-${library.language}`} library={library} />
              ))}
            </div>
          </section>

          {/* Recently Added Section */}
          <section className="relative">
            <div className="flex items-center mb-10">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    Recently Added
                  </h2>
                  <p className="text-gray-400 text-lg mt-2">Fresh additions to the collection</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentData?.libraries?.map((library: Library) => (
                <LibraryCard key={`${library.name}-${library.language}`} library={library} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Empty state fallback */}
      {!isLoading && !hasError && (!trendingData?.libraries?.length && !recentData?.libraries?.length) && (
        <div className="text-center py-20">
          <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto border border-gray-700/50 backdrop-blur-sm">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
            </svg>
            <h3 className="text-2xl font-semibold text-white mb-3">No Libraries Found</h3>
            <p className="text-gray-400 text-lg">Check back later for new library additions.</p>
          </div>
        </div>
      )}
    </div>
  );
}