'use client';

import { useState } from 'react';
import { PracticeQuestion, ExecutionResult } from '@/types/DSA';
import CodeEditor from './CodeEditor';
import VisualizerSelector from './visualizers/VisualizerSelector';
import { Card, CardContent } from '@/components/documentation/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/documentation/ui/tabs';

interface PracticePanelProps {
  question: PracticeQuestion;
  onComplete: () => void; 
}

export default function PracticePanel({ question, onComplete }: PracticePanelProps)  {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('visualizer');

  const handleRunCode = async (code: string) => {
    try {
      setIsRunning(true);
      
      const response = await fetch('/api/run-visualized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: code,
          languageId: question.languageId,
          problemId: question.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to run code');
      }
      
      const result = await response.json();
      setExecutionResult(result);
      
      // Switch to visualizer tab if execution was successful
      if (result.success) {
        setActiveTab('visualizer');
      } else {
        setActiveTab('output');
      }
    } catch (error) {
      console.error('Error running code:', error);
      setExecutionResult({
        success: false,
        finalOutput: error instanceof Error ? error.message : 'An unknown error occurred',
        visualizationSteps: [],
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setActiveTab('output');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Left panel: Code Editor */}
      <div className="h-[500px]">
        <CodeEditor
          initialCode={question.initialCode}
          languageId={question.languageId}
          problemId={question.id}
          onRunCode={handleRunCode}
          isRunning={isRunning}
        />
      </div>
      
      {/* Right panel: Visualizer/Output */}
      <div className="h-[500px]">
        <Card className="h-full border border-white/10 bg-black/30">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualizer" className="h-[calc(100%-40px)]">
              <CardContent className="p-0 h-full">
                <VisualizerSelector
                  visualizerType={question.visualizerType}
                  visualizationSteps={executionResult?.visualizationSteps || []}
                  isRunning={isRunning}
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="output" className="h-[calc(100%-40px)]">
              <CardContent className="p-4 h-full">
                <div className="bg-black/20 border border-white/10 p-4 rounded-lg h-full overflow-auto font-mono text-sm text-slate-300">
                  {isRunning ? (
                    <p>Running code...</p>
                  ) : executionResult ? (
                    <div>
                      <div className={`mb-2 font-bold ${executionResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {executionResult.success ? 'Success' : 'Error'}
                      </div>
                      {executionResult.error && (
                        <div className="text-red-400 mb-2">
                          {executionResult.error}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">
                        {executionResult.finalOutput || 'No output'}
                      </div>
                    </div>
                  ) : (
                    <p>Run your code to see the output</p>
                  )}
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}