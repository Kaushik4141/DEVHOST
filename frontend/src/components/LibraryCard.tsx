'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';
import { Library } from '@/types/Library';

interface LibraryCardProps {
  library: Library;
  index?: number;
  totalCards?: number;
  isInitialLoad?: boolean;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ 
  library, 
  index = 0, 
  totalCards = 1,
  isInitialLoad = true 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false); // Changed from useState to useRef

  const linkUrl = library.homepage || library.repository_url;
  useLenis();

  useEffect(() => {
    if (!cardRef.current || !contentRef.current || hasAnimatedRef.current) return;

    const tl = gsap.timeline();

    if (isInitialLoad && !hasAnimatedRef.current) {
      // Initial stack position - all cards stacked at center
      const stackOffset = (index - (totalCards - 1) / 2) * 4; // Small offset for stack effect
      const rotation = (index - (totalCards - 1) / 2) * 2; // Slight rotation variation
      
      // Set initial stacked state
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        rotationY: rotation,
        rotationX: -15,
        x: stackOffset,
        y: stackOffset * 0.5,
        z: -index * 20, // Depth for stack
        transformPerspective: 1000,
        transformOrigin: 'center center'
      });

      // Animate from stack to final position
      tl.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        delay: index * 0.15, // Stagger the animations
        ease: 'power3.out'
      });

      // Content animation
      tl.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power2.out' 
        },
        '-=0.6'
      );

      hasAnimatedRef.current = true; // Set ref to true
    } else if (!isInitialLoad) {
      // Regular entry animation for subsequent loads
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 80, rotationX: -10, transformPerspective: 1000 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1, delay: index * 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.5'
      );

      hasAnimatedRef.current = true;
    }

    // Hover effects
    const handleEnter = () => {
      gsap.to(cardRef.current, {
        y: -12,
        rotationX: 5,
        rotationY: 2,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(glowRef.current, {
        opacity: 0.3,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const el = cardRef.current;
    el?.addEventListener('mouseenter', handleEnter);
    el?.addEventListener('mouseleave', handleLeave);

    return () => {
      el?.removeEventListener('mouseenter', handleEnter);
      el?.removeEventListener('mouseleave', handleLeave);
    };
  }, [index, totalCards, isInitialLoad]); // Removed hasAnimated from dependencies

  return (
    <div className="relative w-full flex justify-center">
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-2xl blur-2xl opacity-30 scale-100 transition-all duration-500 -z-10"
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative aspect-square w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 backdrop-blur-sm transform-gpu hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Content */}
        <div ref={contentRef} className="relative p-6 z-10 flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
              {library.name}
            </h3>
            {library.language && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 backdrop-blur-sm">
                {library.language}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
            {library.description || 'No description available'}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              {/* Stars */}
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-400 text-sm">{library.stars.toLocaleString()}</span>
              </div>

              {/* Forks */}
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-400 text-sm">{library.forks.toLocaleString()}</span>
              </div>
            </div>

            {library.latest_release_number && (
              <span className="text-xs font-semibold bg-gray-800/50 text-gray-400 px-2 py-1 rounded-lg border border-gray-700/50">
                v{library.latest_release_number}
              </span>
            )}
          </div>

          {/* CTA */}
          <Link
            href={linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 relative block w-full text-center py-3 px-6 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 border border-blue-500/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center justify-center text-sm">
              Explore Library
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_70%)] opacity-50" />
      </div>
    </div>
  );
};

export default LibraryCard;