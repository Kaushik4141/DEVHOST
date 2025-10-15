"use client";

import { useState } from "react";
import { Terminal, Copy, Check, BookmarkPlus } from "lucide-react";
import { useNotes } from "./NotesContext";

export type DocItem = {
  title?: string;
  explanation?: string;
  key_points?: string[];
  example?: any;
  related_terms?: string[];
  code_snippet?: any;
  original_source_url?: string;
  search_name?: string;
};

export default function DocCard({ item }: { item: DocItem }) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const notes = useNotes();
  const addContentToActiveNote = notes?.addContentToNote || (() => {});
  
  const onCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 1500);
  };
  
  const saveToNotes = (text: string, type: string) => {
    const content = `## ${item.title || 'Documentation'} - ${type}\n\n${text}`;
    addContentToActiveNote(content);
  };

  return (
    <div className="space-y-6">
      {item.title && (
        <h1 className="text-3xl font-bold text-white">{item.title}</h1>
      )}

      {item.explanation && (
        <div className="relative group">
          <p className="text-slate-300 leading-relaxed pr-8">{item.explanation}</p>
          <button
            onClick={() => saveToNotes(item.explanation ?? '', 'Explanation')}
            className="absolute top-0 right-0 p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Save to notes"
            title="Save to notes"
          >
            <BookmarkPlus className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      )}

      {Array.isArray(item.key_points) && item.key_points.length > 0 && (
        <div className="relative group">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Key points</h3>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            {item.key_points.map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          <button
            onClick={() => saveToNotes(`## ${item.title || 'Documentation'} - Key Points\n\n${item.key_points?.map(p => `- ${p}`).join('\n')}`, 'Key Points')}
            className="absolute top-0 right-0 p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Save to notes"
            title="Save to notes"
          >
            <BookmarkPlus className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      )}

      {item.example != null && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
          <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Example</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => saveToNotes(typeof item.example === 'string' ? item.example : JSON.stringify(item.example, null, 2), 'Example')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Save to notes"
                  title="Save to notes"
                >
                  <BookmarkPlus className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => onCopy(typeof item.example === 'string' ? item.example : JSON.stringify(item.example, null, 2), `ex`)}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Copy example"
                >
                  {copied[`ex`] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-cyan-300 font-mono">
                {typeof item.example === 'string' ? item.example : JSON.stringify(item.example, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      )}

      {item.code_snippet != null && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
          <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-sm font-medium">Code</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => saveToNotes(typeof item.code_snippet === 'string' ? item.code_snippet : JSON.stringify(item.code_snippet, null, 2), 'Code')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Save to notes"
                  title="Save to notes"
                >
                  <BookmarkPlus className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => onCopy(typeof item.code_snippet === 'string' ? item.code_snippet : JSON.stringify(item.code_snippet, null, 2), `code`)}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  aria-label="Copy code"
                >
                  {copied[`code`] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-cyan-300 font-mono">
                {typeof item.code_snippet === 'string' ? item.code_snippet : JSON.stringify(item.code_snippet, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      )}

      {Array.isArray(item.related_terms) && item.related_terms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.related_terms.map((t: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400">{t}</span>
          ))}
        </div>
      )}

      {item.original_source_url && (
        <a href={item.original_source_url} target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-4">
          Source
        </a>
      )}
    </div>
  );
}
