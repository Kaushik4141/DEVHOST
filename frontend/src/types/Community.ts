// Community feature type definitions

export interface User {
  _id: string;
  clerkId: string;
  username: string;
  avatarUrl?: string;
  profileImageUrl?: string; // For Clerk user profile image
  email?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for profile card
  bio?: string;
  location?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface Hashtag {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  content: string;
  author: User;
  likes: string[]; // Array of user IDs
  hashtags: Hashtag[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface GetPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

export interface ToggleLikeResponse {
  success: boolean;
  message: string;
  data: {
    post: Post;
    liked: boolean;
    likeCount: number;
  };
}

export interface TrendingHashtag {
  id: string;
  name: string;
  count: number;
  latestPost: string;
}

export interface GetTrendingResponse {
  success: boolean;
  message: string;
  data: {
    trendingHashtags: TrendingHashtag[];
    timeRange: string;
    generatedAt: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
