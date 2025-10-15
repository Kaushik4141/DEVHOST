'use client';

import { useState, useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Button } from '@/components/UI/button';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  languageId: number;
  problemId: string;
  onRunCode: (code: string) => void;
  isRunning: boolean;
}

// Map Judge0 language IDs to Monaco editor language identifiers
const languageIdToMonacoLanguage: Record<number, string> = {
  63: 'javascript', // JavaScript Node.js
  71: 'python',     // Python 3
  54: 'cpp',        // C++ (GCC)
  62: 'java',       // Java
  78: 'typescript', // TypeScript
  82: 'csharp',     // C#
  // Add more mappings as needed
};

export default function CodeEditor({
  initialCode,
  languageId,
  problemId,
  onRunCode,
  isRunning,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<any>(null);
  
  // Get Monaco language from Judge0 language ID
  const monacoLanguage = languageIdToMonacoLanguage[languageId] || 'javascript';

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Set editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: true,
      automaticLayout: true,
    });
  }

  function handleEditorChange(value: string | undefined) {
    setCode(value || '');
  }

  function handleRunCode() {
    if (editorRef.current) {
      const currentCode = editorRef.current.getValue();
      onRunCode(currentCode);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border border-white/10 rounded-t-lg overflow-hidden h-full">
        <Editor
          height="300px"
          language={monacoLanguage}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: isRunning,
          }}
          loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
        />
      </div>
      <div className="flex justify-end p-2 bg-black/30 border-x border-b border-white/10 rounded-b-lg">
        <Button 
          onClick={handleRunCode} 
          disabled={!isEditorReady || isRunning}
          className="space-x-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <span>Run Code</span>
          )}
        </Button>
      </div>
    </div>
  );
}