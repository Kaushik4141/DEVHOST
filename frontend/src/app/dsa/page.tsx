'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DSATopic } from '@/types/DSA';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/UI/badge';
import { Skeleton } from '@/components/UI/skeleton';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

// Force black background globally
if (typeof document !== 'undefined') {
  document.documentElement.style.backgroundColor = '#000';
  document.body.style.backgroundColor = '#000';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.border = 'none';
}

export default function DSAIndexPage() {
  const [topics, setTopics] = useState<DSATopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Header animation
  useEffect(() => {
    if (!headerRef.current || !titleRef.current) return;
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0, rotationX: 5 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: 'power2.out' }
    ).fromTo(
      '.subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.7, duration: 0.9, ease: 'power2.out' },
      '-=0.6'
    );
  }, [loading]);

  // Cards animation
  useEffect(() => {
    if (loading || !cardsRef.current || topics.length === 0) return;

    const cards = gsap.utils.toArray('.topic-card');

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.95, rotationY: 5 },
      { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Hover animations
    cards.forEach((card: any) => {
      const hoverAnimation = gsap.to(card, {
        scale: 1.03,
        y: -8,
        rotationY: 2,
        rotationX: 1,
        boxShadow: '0 20px 40px rgba(0, 255, 255, 0.15)',
        borderColor: 'rgba(34, 211, 238, 0.3)',
        duration: 0.3,
        ease: 'power2.out',
        paused: true,
      });

      card.addEventListener('mouseenter', () => hoverAnimation.play());
      card.addEventListener('mouseleave', () => hoverAnimation.reverse());

      // Cleanup function
      return () => {
        card.removeEventListener('mouseenter', () => hoverAnimation.play());
        card.removeEventListener('mouseleave', () => hoverAnimation.reverse());
      };
    });
  }, [loading, topics]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dsa-content');
      if (!response.ok) throw new Error('Failed to fetch DSA content');
      const data = await response.json();
      setTopics(data.dsaContent.topics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden !bg-black">
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div ref={headerRef} className="sticky top-0 pt-8 pb-12 bg-black z-20">
            <Skeleton className="h-12 w-96 max-w-full mb-4 bg-white/10" />
            <Skeleton className="h-6 w-64 max-w-full bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="border border-black/10 bg-black/20 rounded-xl p-6 hover:border-cyan-500/20 transition-colors duration-300"
                >
                  <Skeleton className="h-8 w-3/4 mb-3 bg-white/10" />
                  <Skeleton className="h-4 w-full mb-2 bg-white/5" />
                  <Skeleton className="h-4 w-full mb-2 bg-white/5" />
                  <Skeleton className="h-4 w-2/3 mb-4 bg-white/5" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 bg-white/5" />
                    <Skeleton className="h-6 w-20 bg-white/5" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center !bg-black">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
            <p className="font-medium text-lg mb-2">Error Loading Content</p>
            <p className="opacity-80">{error}</p>
            <button
              onClick={fetchTopics}
              className="mt-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden !bg-black">
      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="sticky top-0 pt-8 pb-12 bg-black z-20 !bg-black">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent tracking-tight"
          >
            Data Structures & Algorithms
          </h1>
          <p className="subtitle text-xl text-slate-300/80 font-light max-w-2xl leading-relaxed">
            Learn and practice DSA concepts with interactive visualizations and handcrafted examples
          </p>
        </div>

        {/* Cards grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {topics.map((topic) => (
            <Link href={`/dsa/${topic.slug}`} key={topic.id} className="block">
              <Card className="topic-card h-full cursor-pointer border border-white/10 bg-black/20 rounded-2xl overflow-hidden transform-gpu transition-all duration-300 hover:!scale-105 hover:!shadow-2xl !bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-xl font-semibold text-white mb-2 tracking-tight">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300/70 leading-relaxed text-sm">
                    {topic.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 pb-4">
                  <p className="text-sm text-cyan-300/80 mb-3 font-medium">
                    {topic.practiceQuestions.length} practice questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topic.practiceQuestions.slice(0, 3).map((question) => (
                      <Badge
                        key={question.id}
                        variant="outline"
                        className={`${
                          question.difficulty === 'easy'
                            ? 'bg-green-500/10 text-green-300 border-green-500/30'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {question.difficulty}
                      </Badge>
                    ))}
                    {topic.practiceQuestions.length > 3 && (
                      <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/10">
                        +{topic.practiceQuestions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="relative z-10 pt-4 border-t border-white/5">
                  <div className="flex items-center text-cyan-400 font-medium group">
                    <span className="text-sm">Start learning</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-12 text-slate-500 text-sm relative z-10">
        Crafted with attention to detail • Interactive DSA Learning
      </div>
    </div>
  );
}
