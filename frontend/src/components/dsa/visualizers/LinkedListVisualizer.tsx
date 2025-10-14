'use client';

import { useMemo } from 'react';
import BaseVisualizer from './BaseVisualizer';
import { VisualizationStep } from '@/types/DSA';

interface LinkedListVisualizerProps {
  visualizationSteps: VisualizationStep[];
  isRunning: boolean;
}

export default function LinkedListVisualizer({
  visualizationSteps,
  isRunning,
}: LinkedListVisualizerProps) {
  const currentStepIndex = useMemo(() => {
    return visualizationSteps.length > 0 ? 0 : -1;
  }, [visualizationSteps]);

  const currentStep = useMemo(() => {
    return currentStepIndex >= 0 ? visualizationSteps[currentStepIndex] : null;
  }, [visualizationSteps, currentStepIndex]);

  // Render the linked list nodes based on the current step
  const renderLinkedList = () => {
    if (!currentStep) return null;

    // Extract node values from the current step
    // This is a simplified example - in a real implementation,
    // you would need to build the linked list structure from the visualization steps
    const prevNode = currentStep.prev;
    const currNode = currentStep.curr;
    
    // For demonstration, we'll create a simple linked list with 5 nodes
    const nodes = [1, 2, 3, 4, 5];
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center space-x-2 mb-8">
          {nodes.map((value, index) => {
            const isPrev = prevNode === value;
            const isCurr = currNode === value;
            
            return (
              <div key={index} className="flex items-center">
                {/* Node */}
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2
                    ${isPrev ? 'border-blue-500 bg-blue-100' : ''}
                    ${isCurr ? 'border-green-500 bg-green-100' : ''}
                    ${!isPrev && !isCurr ? 'border-gray-300' : ''}
                  `}
                >
                  {value}
                </div>
                
                {/* Arrow */}
                {index < nodes.length - 1 && (
                  <div className="w-8 h-0.5 bg-slate-400 relative ml-2">
                    <div className="absolute -right-1 -top-1 border-t-4 border-r-4 border-b-4 border-l-0 border-transparent border-r-slate-400 transform rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 mb-2"></div>
            <span className="text-sm">prev</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 mb-2"></div>
            <span className="text-sm">current</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseVisualizer
      visualizationSteps={visualizationSteps}
      isRunning={isRunning}
    >
      {renderLinkedList()}
    </BaseVisualizer>
  );
}