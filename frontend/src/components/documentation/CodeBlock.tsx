'use client';

import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  id: string;
}

export default function CodeBlock({ code, language = 'typescript', fileName, id }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
      <div className="relative bg-[#000000] rounded-lg border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2 text-slate-400">
            {!fileName && <Terminal className="w-4 h-4" />}
            <span className="text-sm font-medium">{fileName || 'Terminal'}</span>
          </div>
          <button
            onClick={() => copyToClipboard(code)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-cyan-300 font-mono whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}