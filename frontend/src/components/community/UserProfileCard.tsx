'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { Button } from '@/components/UI/button';
import { User, Calendar, MapPin, Link2, Twitter, Github } from 'lucide-react';
import type { User as UserType } from '@/types/Community';

interface UserProfileCardProps {
  user: UserType;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function UserProfileCard({ user, isVisible, position, onClose }: UserProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Close the card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);
  
  // Adjust position to ensure card stays within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 320), // 320px is approximate card width
    y: Math.min(position.y, window.innerHeight - 400), // 400px is approximate card height
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={cardRef}
      className="absolute z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      {/* Card Header with Background */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg relative">
        <div className="absolute -bottom-12 left-4">
          <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-md">
            <AvatarImage src={user.profileImageUrl} alt={user.username} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* User Info */}
      <div className="pt-14 px-4 pb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">@{user.username.toLowerCase()}</p>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {user.bio || 'No bio available'}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {user.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{user.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user.website && (
            <div className="flex items-center">
              <Link2 className="h-4 w-4 mr-2" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{user.followersCount || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{user.followingCount || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{user.postsCount || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
            Follow
          </Button>
          <Button variant="outline" className="flex-1">
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}