'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useToggleLike } from '@/hooks/useCommunity';
import { Button } from '@/components/UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, Copy, Check, Loader2, Share2 } from 'lucide-react';
import UserProfileCard from './UserProfileCard';
import type { Post } from '@/types/Community';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useUser();
  const { toggleLike } = useToggleLike();
  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likes);

  const isLiked = user ? optimisticLikes.includes(user.id) : false;
  const likeCount = optimisticLikes.length;

  const handleLike = async () => {
    if (!user || isLiking) return;

    // Optimistic update
    const wasLiked = isLiked;
    setOptimisticLikes(prev => 
      wasLiked 
        ? prev.filter(id => id !== user.id)
        : [...prev, user.id]
    );
    setIsLiking(true);

    try {
      await toggleLike(post._id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setOptimisticLikes(post.likes);
    } finally {
      setIsLiking(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const renderContent = (content: string) => {
    // Split content by hashtags and render them as clickable links
    const parts = content.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium"
            onClick={() => {
              // You could implement hashtag navigation here
              console.log('Navigate to hashtag:', part);
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add fade-in animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleShare = async () => {
    try {
      // Create a shareable URL for the post
      const shareUrl = `${window.location.origin}/community/post/${post._id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author.username}`,
          text: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // User profile card state
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profileCardPosition, setProfileCardPosition] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse enter on avatar or username
  const handleProfileMouseEnter = (e: React.MouseEvent) => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setProfileCardPosition({ 
        x: rect.left, 
        y: rect.bottom + window.scrollY 
      });
      setShowProfileCard(true);
    }
  };
  
  // Handle mouse leave
  const handleProfileMouseLeave = () => {
    // Use a timeout to prevent the card from disappearing immediately
    // when moving from avatar to the card itself
    const timeout = setTimeout(() => {
      setShowProfileCard(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  };
  
  return (
    <article className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex space-x-3">
        <div 
          ref={avatarRef}
          className="relative"
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-100 dark:ring-blue-900/30 hover:ring-blue-200 dark:hover:ring-blue-800/30 transition-all duration-300 cursor-pointer">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400">
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 
              className="font-semibold text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              {post.author.username}
            </h3>
            <span className="text-gray-500 text-sm">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          <div className="text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
            {renderContent(post.content)}
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 ${
                isLiked ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/10' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current transition-transform duration-300 scale-110' : 'scale-100'}`} />
              )}
              <span className="text-sm">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">0</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Copied</span>
                </>
              ) : (
                <>
                  <Share className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 ml-auto rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* User Profile Card */}
      <UserProfileCard 
        user={{
          ...post.author,
          createdAt: post.createdAt,
          followersCount: 123, // Example data
          followingCount: 45,  // Example data
          postsCount: 67,      // Example data
          bio: "Community member passionate about learning and sharing knowledge.",
          location: "Global",
          website: "https://example.com"
        }} 
        isVisible={showProfileCard}
        position={profileCardPosition}
        onClose={() => setShowProfileCard(false)}
      />
    </article>
  );
}
