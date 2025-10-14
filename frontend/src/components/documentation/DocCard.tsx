"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

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
  const onCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 1500);
  };

  return (
    <div className="space-y-6">
      {item.title && (
        <h1 className="text-3xl font-bold text-white">{item.title}</h1>
      )}

      {item.explanation && (
        <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
      )}

      {Array.isArray(item.key_points) && item.key_points.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Key points</h3>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            {item.key_points.map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
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
