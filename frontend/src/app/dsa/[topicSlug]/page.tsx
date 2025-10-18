'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DSATopic, PracticeQuestion } from '@/types/DSA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/documentation/ui/tabs';
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/skeleton';
import PracticePanel from '@/components/dsa/PracticePanel';
import SolveProblem from '@/components/dsa/SolveProblem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/documentation/ui/dialog';
import { 
  BookOpen, 
  PlayCircle, 
  Code2, 
  ArrowLeft, 
  Clock, 
  BarChart3, 
  CheckCircle2,
  Star,
  Target,
  Sparkles,
  Video,
  FileText,
  Lightbulb,
  Zap,
  Brain,
  TrendingUp
} from 'lucide-react';

// GSAP imports
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lenis smooth scroll
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function DSATopicPage() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState<DSATopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dsa-content');
        
        if (!response.ok) throw new Error('Failed to fetch DSA content');
        
        const data = await response.json();
        const foundTopic = data.dsaContent.topics.find((t: DSATopic) => t.slug === topicSlug);
        
        if (!foundTopic) throw new Error('Topic not found');
        
        setTopic(foundTopic);
        if (foundTopic.practiceQuestions.length > 0) {
          setSelectedQuestion(foundTopic.practiceQuestions[0]);
        }

        // Load completed questions from localStorage
        const saved = localStorage.getItem(`completed-${topicSlug}`);
        if (saved) setCompletedQuestions(new Set(JSON.parse(saved)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopic();
  }, [topicSlug]);

  // Animations
  useEffect(() => {
    if (loading || error || !topic) return;

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out"
        }
      );

      // Floating particles animation
      gsap.to(".floating-particle", {
        y: -20,
        rotation: 360,
        duration: 3,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Content stagger animation
      gsap.fromTo(".content-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Tab content animation
      gsap.fromTo(`[data-tab="${activeTab}"]`,
        { opacity: 0, x: activeTab === 'learn' ? 30 : -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, error, topic, activeTab]);

  const handleTabChange = (value: string) => {
    gsap.to(`[data-tab="${activeTab}"]`, {
      opacity: 0,
      x: value === 'learn' ? -30 : 30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setActiveTab(value)
    });
  };

  const handleQuestionSelect = (question: PracticeQuestion) => {
    const button = document.querySelector(`[data-question="${question.id}"]`);
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    setTimeout(() => {
      setSelectedQuestion(question);
      setDialogOpen(true);
    }, 200);
  };

  const markQuestionCompleted = (questionId: string) => {
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(questionId);
    setCompletedQuestions(newCompleted);
    localStorage.setItem(`completed-${topicSlug}`, JSON.stringify(Array.from(newCompleted)));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500/20 to-green-600/10 text-green-400 border-green-500/30';
      case 'medium': return 'from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'from-red-500/20 to-red-600/10 text-red-400 border-red-500/30';
      default: return 'from-gray-500/20 to-gray-600/10 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-800 rounded-lg"></div>
                <div className="h-32 bg-gray-800 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-800 rounded-lg"></div>
                <div className="h-24 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md mx-auto">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-4">{error || 'Topic not found'}</p>
            <Link href="/dsa">
              <Button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to DSA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Back Navigation */}
        <Link href="/dsa" className="inline-block mb-6 group">
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-all duration-300 group-hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DSA Topics
          </Button>
        </Link>

        {/* Hero Section */}
        <div ref={heroRef} className="relative mb-12">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
{/* topic.category removed – property does not exist on DSATopic */}
                  </span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                  {topic.title}
                </h1>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {topic.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>30 min read</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <BarChart3 className="w-4 h-4" />
                    <span>{topic.practiceQuestions.length} Problems</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>Fundamental Concept</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-gray-800">
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div ref={contentRef}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <TabsList className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-1 rounded-2xl w-full max-w-md mx-auto">
              <TabsTrigger 
                value="learn" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn Concept
              </TabsTrigger>
              <TabsTrigger 
                value="practice" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Practice Problems
                {topic.practiceQuestions.length > 0 && (
                  <span className="ml-2 bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {topic.practiceQuestions.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learn" data-tab="learn" className="space-y-8 content-item">
              {/* Learning Path */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Overview Card */}
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Overview</h2>
                    </div>
                    <div 
                      className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: topic.explanation }}
                    />
                  </div>

                  {/* Key Concepts */}
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-purple-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Key Concepts</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                        <h3 className="font-semibold text-white mb-2">Time Complexity</h3>
                        <p className="text-gray-300 text-sm">Learn the efficiency analysis</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <Brain className="w-6 h-6 text-blue-400 mb-2" />
                        <h3 className="font-semibold text-white mb-2">Implementation</h3>
                        <p className="text-gray-300 text-sm">Step-by-step coding guide</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                        <h3 className="font-semibold text-white mb-2">Optimization</h3>
                        <p className="text-gray-300 text-sm">Best practices and tips</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <Target className="w-6 h-6 text-red-400 mb-2" />
                        <h3 className="font-semibold text-white mb-2">Use Cases</h3>
                        <p className="text-gray-300 text-sm">Real-world applications</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Video Card */}
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Video className="w-5 h-5 text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Video Tutorial</h3>
                    </div>
                    <div className="aspect-video bg-black/40 border border-gray-700 rounded-xl overflow-hidden mb-3">
                      <video 
                        controls 
                        poster={topic.conceptVideo.thumbnailUrl}
                        className="w-full h-full object-cover"
                      >
                        <source src={topic.conceptVideo.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <p className="text-sm font-medium text-white mb-2">{topic.conceptVideo.title}</p>
                    <p className="text-xs text-gray-400">Watch this comprehensive tutorial to reinforce your understanding</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400"
                        onClick={() => setActiveTab('practice')}
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        Start Practicing
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-700 text-gray-300 hover:text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Notes
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-700 text-gray-300 hover:text-white"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Take Quiz
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="practice" data-tab="practice" className="space-y-8">
              {topic.practiceQuestions.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  {/* Questions List */}
                  <div className="xl:col-span-1 space-y-6 content-item">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-green-400" />
                          Problems
                        </h2>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                          {topic.practiceQuestions.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {topic.practiceQuestions.map((question, index) => {
                          const isCompleted = completedQuestions.has(question.id);
                          const isSelected = selectedQuestion?.id === question.id;
                          
                          return (
                            <button
                              key={question.id}
                              data-question={question.id}
                              onClick={() => handleQuestionSelect(question)}
                              className={`w-full text-left p-3 rounded-xl transition-all duration-300 group border ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-lg shadow-green-500/20' 
                                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                              } ${isCompleted && !isSelected ? 'border-green-500/30 bg-green-500/10' : ''}`}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                                  isSelected 
                                    ? 'bg-white/20 text-white' 
                                    : isCompleted
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`font-medium text-sm truncate transition-colors ${
                                    isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                  }`}>
                                    {question.title}
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(question.difficulty)}`}>
                                      {question.difficulty}
                                    </span>
                                    {isCompleted && !isSelected && (
                                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 content-item">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        Your Progress
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Completed</span>
                          <span className="text-green-400 font-semibold">
                            {completedQuestions.size}/{topic.practiceQuestions.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-green-500/20"
                            style={{ 
                              width: `${(completedQuestions.size / topic.practiceQuestions.length) * 100}%` 
                            }}
                          />
                        </div>
                        {completedQuestions.size === topic.practiceQuestions.length ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg p-3">
                            <Star className="w-4 h-4" />
                            <span>All problems completed! 🎉</span>
                          </div>
                        ) : completedQuestions.size > 0 ? (
                          <div className="text-center">
                            <Button 
                              className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400"
                              onClick={() => {
                                const nextIncomplete = topic.practiceQuestions.find(
                                  q => !completedQuestions.has(q.id)
                                );
                                if (nextIncomplete) handleQuestionSelect(nextIncomplete);
                              }}
                            >
                              Continue Practice
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Practice Panel */}
                  <div className="xl:col-span-3 content-item">
                    {selectedQuestion ? (
                      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedQuestion.title}</h2>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                                {getDifficultyIcon(selectedQuestion.difficulty)} {selectedQuestion.difficulty}
                              </span>
                              {completedQuestions.has(selectedQuestion.id) && (
                                <span className="flex items-center gap-1 text-green-400 text-sm bg-green-500/10 px-3 py-1 rounded-full">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => setDialogOpen(true)}
                            className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                          >
                            <Code2 className="w-4 h-4 mr-2" />
                            Solve Problem
                          </Button>
                        </div>
                        
                        <div 
                          className="prose prose-invert max-w-none mb-6 text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: selectedQuestion.description }}
                        />
                        
                        <div className="mt-8">
                          <PracticePanel 
                            question={selectedQuestion}
                            onComplete={() => markQuestionCompleted(selectedQuestion.id)}

                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
                        <div className="text-center py-16">
                          <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            Select a Problem to Start Coding
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Choose a problem from the list to begin practicing your skills
                          </p>
                          <Button 
                            onClick={() => handleQuestionSelect(topic.practiceQuestions[0])}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Start with First Problem
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl content-item">
                  <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No Practice Questions Available
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Practice questions for this topic are coming soon!
                  </p>
                  <Button 
                    onClick={() => setActiveTab('learn')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Practice Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="practice-dialog bg-gray-900/95 backdrop-blur-md border border-gray-800 text-white max-w-6xl w-[95vw] rounded-2xl p-0 overflow-hidden">
          {selectedQuestion && (
            <>
              <DialogHeader className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {selectedQuestion.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-2">
                      <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                        {getDifficultyIcon(selectedQuestion.difficulty)} {selectedQuestion.difficulty.charAt(0).toUpperCase() + selectedQuestion.difficulty.slice(1)} Difficulty
                      </span>
                      {completedQuestions.has(selectedQuestion.id) && (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDialogOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Show problem description and the SolveProblem editor (monaco) */}
                <div 
                  className="prose prose-invert max-w-none mb-6 text-gray-300"
                  dangerouslySetInnerHTML={{ __html: selectedQuestion.description }}
                />

                {/* Use the SolveProblem component to provide full editor + run/save UI. Pass the question id as string. */}
                <div className="mt-6">
                  <SolveProblem problemId={selectedQuestion.id} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}