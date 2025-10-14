"use client";

import React, { useMemo, useState } from "react";
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

export default function DynamicContent({ items }: { items?: DocItem[] }) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const slug = (t?: string) =>
    (t || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const hasItems = Array.isArray(items) && items.length > 0;

  const onCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 1500);
  };

  if (!hasItems) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Documentation</h2>
        <p className="text-slate-400">No documentation found. Ingest content to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-16">
      {items!.map((it: DocItem, idx: number) => (
        <section key={idx} id={slug(it.search_name || it.title)} className="doc-section space-y-6">
          {it.title && <h2 className="text-3xl font-bold text-white">{it.title}</h2>}
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

          {it.example != null && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
              <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium">Example</span>
                  </div>
                  <button
                    onClick={() => onCopy(typeof it.example === 'string' ? it.example : JSON.stringify(it.example, null, 2), `ex-${idx}`)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Copy example"
                  >
                    {copied[`ex-${idx}`] ? (
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
                    onClick={() => onCopy(typeof it.code_snippet === 'string' ? it.code_snippet : JSON.stringify(it.code_snippet, null, 2), `code-${idx}`)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Copy code"
                  >
                    {copied[`code-${idx}`] ? (
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
    </div>
  );
}
