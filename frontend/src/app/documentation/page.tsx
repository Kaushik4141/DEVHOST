"use client";

import { useState, useEffect, useMemo } from 'react';
import Lenis from '@studio-freight/lenis';
import ChatBotButton from '@/components/documentation/ChatBotButton';
import ChatBotPanel from '@/components/documentation/ChatBotPanel';
import DocCard, { DocItem } from '@/components/documentation/DocCard';
import NotesPanel from '@/components/documentation/NotesPanel';
import { NotesProvider } from '@/components/documentation/NotesContext';
import { StickyNote, X } from 'lucide-react';

export default function DocumentationPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [items, setItems] = useState<DocItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        
        // Get the source parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source');
        
        let cards;
        // Load appropriate knowledge cards based on source parameter
        if (source === 'polar') {
          // Load Polar knowledge cards
          const response = await import('./polar_cards.json');
          cards = response.default;
        } else if (source === 'nodemailer') {
          // Load Nodemailer knowledge cards
          const response = await import('./nodemailer_cards.json');
          cards = response.default;
        } else {
          // Default to Motia knowledge cards
          const response = await import('./motia_knowledge_cards.json');
          cards = response.default;
        }
        
        if (mounted) {
          setItems(cards);
          setSelected(0);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load documentation');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const titles = useMemo(() => {
    return (items || []).map((it, i) => it.search_name || it.title || `Item ${i + 1}`);
  }, [items]);

  const selectedItem = useMemo(() => {
    if (!items || items.length === 0) return null;
    const idx = Math.min(Math.max(selected, 0), items.length - 1);
    return items[idx];
  }, [items, selected]);

  return (
    <NotesProvider>
      <div className="min-h-screen bg-[#0F1115]">
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="text-red-400 mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 border border-white/10 rounded-lg bg-black/30 h-[calc(100vh-6rem)] sticky top-20 overflow-y-auto">
              <div className="p-3 border-b border-white/10 text-sm text-slate-400">Documentation</div>
              <ul className="divide-y divide-white/5">
                {titles.map((t, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setSelected(i)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        selected === i ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                      title={t}
                    >
                      <span className="line-clamp-2">{t}</span>
                    </button>
                  </li>
                ))}
                {titles.length === 0 && (
                  <li className="px-4 py-3 text-slate-500 text-sm">No items</li>
                )}
              </ul>
            </aside>

            <main className={`lg:col-span-${notesOpen ? '2' : '3'}`}>
              <div className="border border-white/10 rounded-lg bg-black/30 p-6 min-h-[50vh]">
                {selectedItem ? (
                  <DocCard item={selectedItem} />
                ) : (
                  <div className="text-slate-400">Loading documentation...</div>
                )}
              </div>
            </main>

            {/* Notes Panel */}
            {notesOpen && (
              <div className="lg:col-span-1 h-[calc(100vh-6rem)] sticky top-20">
                <NotesPanel />
              </div>
            )}
          </div>
        </div>

        {/* Notes Button */}
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="fixed bottom-24 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all z-10 flex items-center justify-center"
          aria-label={notesOpen ? "Close Notes" : "Open Notes"}
        >
          {notesOpen ? <X className="w-5 h-5" /> : <StickyNote className="w-5 h-5" />}
        </button>

        <ChatBotButton onClick={() => setChatOpen(true)} />
        <ChatBotPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </NotesProvider>
  );
}
