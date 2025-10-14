'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePosts } from '@/hooks/useCommunity';
import PostCard from './PostCard';
import { Loader2, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';

export default function Feed() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { posts, pagination, isLoading, error, mutate } = usePosts(currentPage, 10);
  
  // Filter posts based on search term and active filter
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !activeFilter || 
      (post.content.toLowerCase().includes(activeFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  // Update posts when new data arrives
  useEffect(() => {
    if (posts.length > 0) {
      if (currentPage === 1) {
        setAllPosts(posts);
      } else {
        setAllPosts(prev => [...prev, ...posts]);
      }
      setHasMore(pagination?.hasNextPage || false);
    }
  }, [posts, currentPage, pagination]);

  // Reset when page changes to 1
  useEffect(() => {
    if (currentPage === 1) {
      setAllPosts([]);
      setHasMore(true);
    }
  }, [currentPage]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setCurrentPage(prev => prev + 1);
    // The useEffect above will handle the loading
    setTimeout(() => setIsLoadingMore(false), 1000);
  }, [isLoadingMore, hasMore]);

  const handleRefresh = async () => {
    setCurrentPage(1);
    await mutate();
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p>Failed to load posts</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (allPosts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in opacity-0 translate-y-4">
      <div className="flex flex-col space-y-4 mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search posts or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {['#learning', '#ai', '#technology', '#community'].map(filter => (
              <Button 
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className="rounded-full text-sm whitespace-nowrap transition-all duration-300"
              >
                {filter}
              </Button>
            ))}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(null)}
              className={`rounded-full text-sm whitespace-nowrap transition-all duration-300 ${!activeFilter ? 'hidden' : ''}`}
            >
              <Filter className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
          <p className="text-red-600 dark:text-red-400">Failed to load posts</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="mt-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : filteredPosts.length === 0 && !isLoading ? (
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || activeFilter ? 'No posts match your search' : 'No posts yet'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm || activeFilter ? 
              'Try different search terms or filters' : 
              'Be the first to share something!'}
          </p>
          {(searchTerm || activeFilter) && (
            <Button 
              onClick={() => {
                setSearchTerm('');
                setActiveFilter(null);
              }} 
              variant="outline" 
              size="sm" 
              className="mt-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              Clear Search & Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          
          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Loading more posts...</span>
              </div>
            </div>
          )}

          {/* End of feed indicator */}
          {!hasMore && filteredPosts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">You've reached the end of the feed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
