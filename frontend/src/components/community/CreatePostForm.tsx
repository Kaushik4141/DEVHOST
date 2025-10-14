'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { useCreatePost } from '@/hooks/useCommunity';
import { Button } from '@/components/UI/button';
import { Textarea } from '@/components/UI/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { Send, Loader2, Hash } from 'lucide-react';
import { MAX_POST_LENGTH } from '@/constants/community';

export default function CreatePostForm() {
  const { user } = useUser();
  const { createPost } = useCreatePost();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || content.length > 280) return;
    
    setIsSubmitting(true);
    try {
      await createPost(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <SignedIn>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in opacity-0 translate-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded mr-2"></span>
          Share Your Thoughts
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user?.imageUrl} alt={user?.username || 'User'} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="relative group">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What's happening?"
                  className="min-h-[100px] resize-none border-0 p-0 text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-600"
                  maxLength={MAX_POST_LENGTH || 280}
                />
                <div className="absolute bottom-3 right-3 text-gray-400">
                  <Hash className="h-4 w-4 opacity-50" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className={`transition-colors duration-300 ${content.length > (MAX_POST_LENGTH || 280) * 0.8 ? 'text-amber-500' : content.length > (MAX_POST_LENGTH || 280) * 0.95 ? 'text-red-500' : 'text-gray-500'}`}>
                    {content.length}/{MAX_POST_LENGTH || 280}
                  </span>
                </div>
                
                <Button
                  type="submit"
                  disabled={!content.trim() || content.length > (MAX_POST_LENGTH || 280) || isSubmitting}
                  size="sm"
                  className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SignedIn>
  );
}
