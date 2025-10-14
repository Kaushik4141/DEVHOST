import useSWR, { mutate } from 'swr';
import { useAuth } from '@clerk/nextjs';
import { getPosts, getTrendingHashtags, createPost, toggleLike } from '@/libs/api';
import type { Post, TrendingHashtag } from '@/types/Community';

// SWR fetcher functions
const postsFetcher = async (url: string) => {
  const response = await getPosts();
  return response.data;
};

const trendingFetcher = async () => {
  const response = await getTrendingHashtags();
  return response.data;
};

// Custom hooks
export function usePosts(page: number = 1, limit: number = 10) {
  const { data, error, isLoading } = useSWR(
    `posts-${page}-${limit}`,
    () => postsFetcher(`posts-${page}-${limit}`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    posts: data?.posts || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate: () => mutate(`posts-${page}-${limit}`),
  };
}

export function useTrendingHashtags() {
  const { data, error, isLoading } = useSWR(
    'trending-hashtags',
    trendingFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    trendingHashtags: data?.trendingHashtags || [],
    timeRange: data?.timeRange,
    generatedAt: data?.generatedAt,
    isLoading,
    error,
    mutate: () => mutate('trending-hashtags'),
  };
}

export function useCreatePost() {
  const { getToken } = useAuth();

  const createPostMutation = async (content: string) => {
    const token = await getToken();
    if (!token) throw new Error('No authentication token available');

    const response = await createPost(token, { content });
    
    // Invalidate and revalidate posts cache
    mutate((key) => typeof key === 'string' && key.startsWith('posts-'));
    
    return response;
  };

  return { createPost: createPostMutation };
}

export function useToggleLike() {
  const { getToken } = useAuth();

  const toggleLikeMutation = async (postId: string) => {
    const token = await getToken();
    if (!token) throw new Error('No authentication token available');

    const response = await toggleLike(token, postId);
    
    // Invalidate and revalidate posts cache
    mutate((key) => typeof key === 'string' && key.startsWith('posts-'));
    
    return response;
  };

  return { toggleLike: toggleLikeMutation };
}
