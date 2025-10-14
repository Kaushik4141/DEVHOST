"use client";

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Copy, Check } from 'lucide-react';

// Lazy load the code blocks
const CodeBlock = lazy(() => 
  import('./CodeBlock').then(module => ({
    default: module.default
  }))
);

gsap.registerPlugin(ScrollTrigger);

type DocItem = {
  title?: string;
  explanation?: string;
  key_points?: string[];
  example?: any;
  related_terms?: string[];
  code_snippet?: any;
  original_source_url?: string;
  search_name?: string;
};

export default function MainContent({ items }: { items?: DocItem[] }) {
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

    // Create a single timeline for better performance
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
            // Disable markers in production
            markers: false,
          }
        },
        index * 0.1 // Stagger the animations
      );
    });
  }, contentRef); // Scope GSAP to our component

  return () => {
    ctx.revert(); // More efficient cleanup
  };
}, []);

const slug = (t?: string) =>
  (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const hasDynamic = Array.isArray(items) && items.length > 0;

return (
  <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-8 space-y-16">
    {hasDynamic ? (
      <>
        <section id="introduction" className="doc-section space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Learning Flow, Your Way
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Master development with intuitive, personalized learning paths tailored just for you.
            </p>
          </div>
        </section>
        {items!.map((it: DocItem, idx: number) => (
          <section key={idx} id={slug(it.search_name || it.title)} className="doc-section space-y-6">
            {it.title && (
              <h2 className="text-3xl font-bold text-white">{it.title}</h2>
            )}
            {it.explanation && (
              <p className="text-slate-400 leading-relaxed">{it.explanation}</p>
            )}
            {Array.isArray(it.key_points) && it.key_points.length > 0 && (
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                {it.key_points.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
                  <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Terminal className="w-4 h-4" />
                        <span className="text-sm font-medium">Example</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(typeof it.example === 'string' ? it.example : JSON.stringify(it.example, null, 2), `ex-${idx}`)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        aria-label="Copy example"
                      >
                        {copiedStates[`ex-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-cyan-300 font-mono">
                        {typeof it.example === 'string' ? it.example : JSON.stringify(it.example, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {it.code_snippet != null && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                  <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-sm font-medium">Code</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(typeof it.code_snippet === 'string' ? it.code_snippet : JSON.stringify(it.code_snippet, null, 2), `code-${idx}`)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        aria-label="Copy code"
                      >
                        {copiedStates[`code-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-cyan-300 font-mono">
                        {typeof it.code_snippet === 'string' ? it.code_snippet : JSON.stringify(it.code_snippet, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {Array.isArray(it.related_terms) && it.related_terms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {it.related_terms.map((t: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400">{t}</span>
                  ))}
                </div>
              )}

              {it.original_source_url && (
                <a href={it.original_source_url} target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-4">
                  Source
                </a>
              )}
            </section>
          ))}
        </>
      ) : (
        <>
          <section id="installation" className="doc-section space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Installation</h2>
              <p className="text-slate-400 leading-relaxed">
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
            Install <code className="px-2 py-1 bg-white/10 rounded text-cyan-300 text-sm">tailwindcss</code> and its peer dependencies, then generate your <code className="px-2 py-1 bg-white/10 rounded text-cyan-300 text-sm">tailwind.config.js</code> and <code className="px-2 py-1 bg-white/10 rounded text-cyan-300 text-sm">postcss.config.js</code> files.
          </p>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
            <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-sm font-medium">Terminal</span>
                </div>
                <button
                  onClick={() => copyToClipboard('npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p', 'install')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Copy code"
                >
                  {copiedStates['install'] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-cyan-300 font-mono">
                  npm install -D tailwindcss postcss autoprefixer{'\n'}
                  npx tailwindcss init -p
                </code>
              </pre>
            </div>
          </div>
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

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
            <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-sm font-medium">tailwind.config.js</span>
                </div>
                <button
                  onClick={() => copyToClipboard('/** @type {import(\'tailwindcss\').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}', 'config')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Copy code"
                >
                  {copiedStates['config'] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono">
                  <span className="text-slate-500">{`/** @type {import('tailwindcss').Config} */`}</span>{'\n'}
                  <span className="text-purple-400">export default</span> {'{\n'}
                  {'  '}<span className="text-cyan-300">content</span>: [{'\n'}
                  {'    '}<span className="text-green-300">&quot;./index.html&quot;</span>,{'\n'}
                  {'    '}<span className="text-green-300">&quot;./src/**/*.{js,ts,jsx,tsx}&quot;</span>,{'\n'}
                  {'  '}],{'\n'}
                  {'  '}<span className="text-cyan-300">theme</span>: {'{\n'}
                  {'    '}<span className="text-cyan-300">extend</span>: {'{'}{'}'},{'\n'}
                  {'  '}{'}'},{'\n'}
                  {'  '}<span className="text-cyan-300">plugins</span>: []{',\n'}
                  {'}'}
                </code>
              </pre>
            </div>
          </div>
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
            You can extend the default theme with custom colors, fonts, spacing, and more. Check out the <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">theming guide</a> for advanced customization options.
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
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">Vercel</h3>
            <p className="text-slate-400 text-sm">
              Deploy with zero configuration on Vercel&apos;s edge network for optimal performance.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all group">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">Docker</h3>
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
      </>
    </div>
  );
}
