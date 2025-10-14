'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Home, Users, BookOpen, Settings, MessageSquare, Search, Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import CreatePostForm from '@/components/community/CreatePostForm';
import Feed from '@/components/community/Feed';
import TrendingTopics from '@/components/community/TrendingTopics';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';

export default function CommunityPage() {
  // Add animation effect when component mounts
  useEffect(() => {
    const animateItems = () => {
      const items = document.querySelectorAll('.animate-fade-in');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('opacity-100');
          item.classList.remove('translate-y-4');
        }, 100 * index);
      });
    };
    
    animateItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Navigation - Only visible on small screens */}
        <div className="lg:hidden mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-2">
            <Button size="sm" variant="default" className="rounded-full px-4 whitespace-nowrap">
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Button>
            <Button size="sm" variant="outline" className="rounded-full px-4 whitespace-nowrap">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Community</span>
            </Button>
            <Button size="sm" variant="outline" className="rounded-full px-4 whitespace-nowrap">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Courses</span>
            </Button>
            <Button size="sm" variant="outline" className="rounded-full px-4 whitespace-nowrap">
              <Users className="h-4 w-4 mr-2" />
              <span>Explore</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in opacity-0 translate-y-4">
                <div className="space-y-6">
                  {/* Logo/Brand */}
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      Lernflow
                    </h1>
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Home className="h-5 w-5 mr-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Home</span>
                      </Button>
                    </Link>
                    
                    <Link href="/community">
                      <Button variant="default" className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300">
                        <MessageSquare className="h-5 w-5 mr-3" />
                        <span className="font-medium">Community</span>
                      </Button>
                    </Link>
                    
                    <Link href="/courses">
                      <Button variant="ghost" className="w-full justify-start group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <BookOpen className="h-5 w-5 mr-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Courses</span>
                      </Button>
                    </Link>
                    
                    <Link href="/explore">
                      <Button variant="ghost" className="w-full justify-start group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Users className="h-5 w-5 mr-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">Explore</span>
                      </Button>
                    </Link>
                  </nav>

                  {/* User Section */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <SignedIn>
                      <div className="flex items-center space-x-3">
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "h-10 w-10"
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            Welcome back!
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Share your thoughts
                          </p>
                        </div>
                      </div>
                    </SignedIn>
                    
                    <SignedOut>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          Sign in to join the community
                        </p>
                        <Link href="/sign-in">
                          <Button size="sm" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Main Feed */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Page Header with Search */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm animate-fade-in opacity-0 translate-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      Community Feed
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Connect with fellow learners and share your journey
                    </p>
                  </div>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search posts..." 
                      className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                  <Button size="sm" variant="outline" className="rounded-full px-4 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30 whitespace-nowrap">
                    All Posts
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                    #javascript
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                    #python
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                    #webdev
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                    #machinelearning
                  </Button>
                </div>
              </div>

              {/* Create Post Form */}
              <CreatePostForm />

              {/* Feed */}
              <Feed />
            </div>
          </div>

          {/* Right Column - Trending Topics */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">NOTIFICATIONS</h3>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
              <TrendingTopics />
              
              {/* Additional Sidebar Content */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in opacity-0 translate-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded mr-2"></span>
                  Community Guidelines
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Be respectful and supportive</p>
                  </div>
                  <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Share helpful learning resources</p>
                  </div>
                  <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use relevant hashtags</p>
                  </div>
                  <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Keep posts under 280 characters</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in opacity-0 translate-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded mr-2"></span>
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors duration-300">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">1.2K</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-colors duration-300">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400">5.8K</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Posts Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
