"use client";

import { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Lazy load the code blocks
const CodeBlock = lazy(() => 
  import('./CodeBlock').then(module => ({
    default: module.default
  }))
);

gsap.registerPlugin(ScrollTrigger);

export default function MainContent() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      const sections = contentRef.current!.querySelectorAll('.doc-section');
      
      const tl = gsap.timeline({
        defaults: {
          duration: 0.5,
          ease: 'power2.out'
        }
      });

      sections.forEach((section, index) => {
        tl.fromTo(section,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              markers: false,
            }
          },
          index * 0.1
        );
      });
    }, contentRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black">
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-8 space-y-16">
        <section id="introduction" className="doc-section space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Using Vite with Tailwind CSS
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              A complete guide to setting up Tailwind CSS with Vite for blazing fast development.
            </p>
          </div>
        </section>

        <section id="installation" className="doc-section space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Installation</h2>
            <p className="text-slate-400 leading-relaxed">
              Get started by creating a new Vite project and installing Tailwind CSS along with its peer dependencies.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-200">Create your project</h3>
            <p className="text-slate-400">
              Start by creating a new Vite project if you don&apos;t have one set up already.
            </p>

            <Suspense fallback={<div className="h-32 bg-black/20 animate-pulse rounded-lg" />}>
              <CodeBlock
                code="npm create vite@latest my-project -- --template react\ncd my-project"
                id="create"
              />
            </Suspense>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-200">Install Tailwind CSS</h3>
            <p className="text-slate-400">
              Install <code className="px-2 py-1 bg-white/10 rounded text-cyan-300 text-sm">tailwindcss</code> and its peer dependencies.
            </p>

            <Suspense fallback={<div className="h-32 bg-black/20 animate-pulse rounded-lg" />}>
              <CodeBlock
                code="npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p"
                id="install"
              />
            </Suspense>
          </div>
        </section>

        <section id="configuration" className="doc-section space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Configuration</h2>
            <p className="text-slate-400 leading-relaxed">
              Configure your template paths and add the Tailwind directives to your CSS.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-200">Configure template paths</h3>
            <p className="text-slate-400">
              Add the paths to all of your template files in your <code className="px-2 py-1 bg-white/10 rounded text-cyan-300 text-sm">tailwind.config.js</code> file.
            </p>

            <Suspense fallback={<div className="h-48 bg-black/20 animate-pulse rounded-lg" />}>
              <CodeBlock
                code={`/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`}
                id="config"
                fileName="tailwind.config.js"
              />
            </Suspense>
          </div>
        </section>

        <section id="customization" className="doc-section space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Customization</h2>
            <p className="text-slate-400 leading-relaxed">
              Customize your Tailwind configuration to match your design system.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
            <h4 className="text-lg font-semibold text-cyan-300 mb-2">Pro Tip</h4>
            <p className="text-slate-300">
              You can extend the default theme with custom colors, fonts, spacing, and more. Check out the{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
                theming guide
              </a>{' '}
              for advanced customization options.
            </p>
          </div>
        </section>

        <section id="deployment" className="doc-section space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Deployment</h2>
            <p className="text-slate-400 leading-relaxed">
              Deploy your Vite + Tailwind CSS application to production with these recommended platforms.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all group">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                Vercel
              </h3>
              <p className="text-slate-400 text-sm">
                Deploy with zero configuration on Vercel&apos;s edge network for optimal performance.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all group">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                Docker
              </h3>
              <p className="text-slate-400 text-sm">
                Containerize your application for consistent deployment across any environment.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm text-center">
            Made with care for the developer community
          </p>
        </div>
      </div>
    </div>
  );
}