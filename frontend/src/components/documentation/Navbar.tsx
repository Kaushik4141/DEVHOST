"use client";

import { useState, useEffect } from 'react';
import { Menu, Search, Github } from 'lucide-react';
import { Input } from '@/components/documentation/ui/input';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#000000]/80 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a 
              href="/" 
              className="text-xl font-semibold text-white hover:text-emerald-400 transition-colors"
            >
              LearnFlow
            </a>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full pl-10 bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20"
              />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
