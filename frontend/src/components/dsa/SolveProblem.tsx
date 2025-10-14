"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Card, CardContent } from "@/components/documentation/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/documentation/ui/tabs";
import { Button } from "@/components/UI/button";

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  initialCode: string;
  languageId: number;
}

interface DsaContentResponse {
  dsaContent: {
    topics: Array<{
      id: string;
      title: string;
      practiceQuestions: PracticeProblem[];
    }>;
  };
}

// Judge0 languageId -> label
const languageNameFromId = (id: number) => {
  const map: Record<number, string> = {
    63: "JavaScript (Node.js)",
    71: "Python 3",
    54: "C++ (GCC)",
    62: "Java",
    78: "TypeScript",
    82: "C#",
  };
  return map[id] ?? `Lang ${id}`;
};

// Judge0 languageId -> Monaco language
const getMonacoLanguage = (id: number) => {
  const map: Record<number, string> = {
    63: "javascript",
    71: "python",
    54: "cpp",
    62: "java",
    78: "typescript",
    82: "csharp",
  };
  return map[id] ?? "plaintext";
};

export default function SolveProblem({ problemId }: { problemId: string }) {
  const router = useRouter();
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [languageId, setLanguageId] = useState<number | null>(null);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"description" | "submissions" | "solutions">("description");
  const [testCaseInput, setTestCaseInput] = useState<string>("");
  const [testCaseOutput, setTestCaseOutput] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dsa-content");
        if (!res.ok) throw new Error("Failed to fetch DSA content");
        const data: DsaContentResponse = await res.json();
        // find problem by id
        for (const t of data.dsaContent.topics) {
          const found = t.practiceQuestions.find((q) => q.id === problemId);
          if (found) {
            if (!mounted) return;
            setProblem(found);
            const firstLang = found.languageId ?? 63;
            setLanguageId(firstLang);
            // Load saved code
            const saved = localStorage.getItem(`dsa-code-${problemId}-${firstLang}`);
            setSourceCode(saved ?? found.initialCode ?? "");
            
            // Focus on the code editor after it loads
            setTimeout(() => {
              const editorElement = document.querySelector('.monaco-editor');
              if (editorElement) {
                (editorElement as HTMLElement).focus();
              }
            }, 500);
            
            break;
          }
        }
        if (mounted && !problem) {
          setError("Problem not found");
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load problem");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const allowedLangs = useMemo(() => {
    if (!problem?.languageId) return [63];
    // For now, single default language from problem; extend to array if backend supports
    return [problem.languageId];
  }, [problem]);

  const showSaveNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const onSaveCode = async () => {
    if (!problemId || !languageId) return;
    setSaving(true);
    try {
      localStorage.setItem(`dsa-code-${problemId}-${languageId}`, sourceCode);
      await new Promise((r) => setTimeout(r, 300));
      showSaveNotification("Code saved successfully!");
    } catch (e: any) {
      showSaveNotification("Failed to save code");
    } finally {
      setSaving(false);
    }
  };

  const onRunCode = async () => {
    if (!problemId || !languageId) return;
    setRunning(true);
    setResult(null);
    try {
      const resp = await fetch("/api/run-visualized", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode: sourceCode, languageId, problemId }),
      });
      const data = await resp.json();
      setResult(data);
    } catch (e: any) {
      setResult({ success: false, error: e?.message || "Run failed" });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!problem) {
    return <div className="max-w-5xl mx-auto p-4 text-red-400">{error || "Problem not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      {/* Notification */}
      <div
        className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform ${showNotification ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"} ${notificationMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"}`}
      >
        {notificationMessage}
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors duration-200 p-2 rounded-lg hover:bg-purple-900/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <div className="h-6 w-px bg-gray-600" />
            <div className="space-y-1">
              <div className="text-xs text-purple-300 flex items-center gap-1">
                <Link href="/dsa" className="hover:text-purple-200 transition-colors">
                  DSA
                </Link>
                <span className="mx-1">/</span>
                <span className="hover:text-purple-200 transition-colors">Practice</span>
              </div>
              <h1 className="text-2xl font-semibold text-white bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                {problem.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Problem statement */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg">
            <div className="flex border-b border-gray-700">
              <button
                className={`px-4 py-3 text-sm transition-all duration-300 ${
                  activeTab === "description"
                    ? "text-purple-300 border-b-2 border-purple-500 bg-purple-900/10"
                    : "text-gray-300 hover:text-purple-200 hover:bg-gray-700/30"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-4 py-3 text-sm transition-all duration-300 ${
                  activeTab === "submissions"
                    ? "text-purple-300 border-b-2 border-purple-500 bg-purple-900/10"
                    : "text-gray-300 hover:text-purple-200 hover:bg-gray-700/30"
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions
              </button>
              <button
                className={`px-4 py-3 text-sm transition-all duration-300 ${
                  activeTab === "solutions"
                    ? "text-purple-300 border-b-2 border-purple-500 bg-purple-900/10"
                    : "text-gray-300 hover:text-purple-200 hover:bg-gray-700/30"
                }`}
                onClick={() => setActiveTab("solutions")}
              >
                Solutions
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {activeTab === "description" && (
                <>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        problem.difficulty === "easy"
                          ? "text-green-300 bg-green-900/30"
                          : problem.difficulty === "medium"
                          ? "text-yellow-300 bg-yellow-900/30"
                          : "text-red-300 bg-red-900/30"
                      }`}
                    >
                      {(problem.difficulty || "easy").toString().charAt(0).toUpperCase() + (problem.difficulty || "easy").toString().slice(1)}
                    </span>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <pre className="whitespace-pre-wrap text-gray-300">{problem.description}</pre>
                  </div>
                </>
              )}

              {activeTab === "submissions" && (
                <div className="text-gray-300 p-4 text-center">
                  <p>Your submissions will appear here.</p>
                </div>
              )}

              {activeTab === "solutions" && (
                <div className="text-gray-300 p-4 text-center">
                  <p>Solutions will be available later.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Editor and console */}
          <div className="space-y-4">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg">
              <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-300">Language</label>
                  <select
                    className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-gray-200"
                    value={languageId ?? ""}
                    onChange={(e) => {
                      const newLangId = Number(e.target.value);
                      setLanguageId(newLangId);
                      const savedCode = localStorage.getItem(`dsa-code-${problemId}-${newLangId}`);
                      setSourceCode(savedCode ?? "");
                    }}
                  >
                    {allowedLangs.map((id) => (
                      <option key={id} value={id}>
                        {languageNameFromId(id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={onSaveCode} disabled={saving} variant="outline">
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button type="button" onClick={() => setSourceCode("")}>Reset</Button>
                </div>
              </div>
              <div className="p-3">
                <Editor
                  height="300px"
                  language={languageId ? getMonacoLanguage(languageId) : "plaintext"}
                  theme="vs-dark"
                  value={sourceCode}
                  onChange={(value) => setSourceCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: "monospace",
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    acceptSuggestionOnEnter: "on",
                    cursorBlinking: "smooth",
                    lineNumbers: "on",
                    roundedSelection: true,
                    autoIndent: "full",
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                />
              </div>
              <div className="px-4 py-3 border-t border-gray-700 flex justify-end gap-2">
                <Button onClick={onRunCode} disabled={running || !sourceCode}>
                  {running ? "Running..." : "Run Test"}
                </Button>
              </div>
            </div>

            {/* Result/Console */}
            {result && (
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg">
                {result?.error ? (
                  <div className="text-red-400">{result.error}</div>
                ) : (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${result.success ? "text-green-400 bg-green-900/20 border-green-800/50" : "text-red-400 bg-red-900/20 border-red-800/50"}`}>
                      <div className="font-semibold mb-1">{result.success ? "✅ Success" : "❌ Error"}</div>
                    </div>
                    <div className="text-sm text-gray-400">Final Output</div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 mt-1">
                      <pre className="whitespace-pre-wrap text-gray-300">{result.finalOutput ?? ""}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Test Case Section (UI only for now) */}
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg">
              <div className="px-4 py-3 border-b border-gray-700 text-sm text-gray-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Test Cases
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Input</label>
                  <textarea
                    className="w-full h-20 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-3 font-mono text-sm"
                    value={testCaseInput}
                    onChange={(e) => setTestCaseInput(e.target.value)}
                    placeholder="Enter test case input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Expected Output</label>
                  <textarea
                    className="w-full h-20 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-3 font-mono text-sm"
                    value={testCaseOutput}
                    onChange={(e) => setTestCaseOutput(e.target.value)}
                    placeholder="Enter expected output"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(75, 85, 99, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.5); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.7); }
      `}</style>
    </div>
  );
}
