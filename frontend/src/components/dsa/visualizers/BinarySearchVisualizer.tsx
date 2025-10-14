'use client';

import { useMemo } from 'react';
import BaseVisualizer from './BaseVisualizer';
import { VisualizationStep } from '@/types/DSA';

interface BinarySearchVisualizerProps {
  visualizationSteps: VisualizationStep[];
  isRunning: boolean;
}

export default function BinarySearchVisualizer({
  visualizationSteps,
  isRunning,
}: BinarySearchVisualizerProps) {
  const currentStepIndex = useMemo(() => {
    return visualizationSteps.length > 0 ? 0 : -1;
  }, [visualizationSteps]);

  const currentStep = useMemo(() => {
    return currentStepIndex >= 0 ? visualizationSteps[currentStepIndex] : null;
  }, [visualizationSteps, currentStepIndex]);

  // Render the binary search visualization based on the current step
  const renderBinarySearch = () => {
    if (!currentStep) return null;

    // Extract values from the current step
    const { left, right, mid, value } = currentStep;
    
    // For demonstration, we'll create a simple array with 10 elements
    const array = Array.from({ length: 10 }, (_, i) => i * 10);
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-end mb-8">
          {array.map((val, index) => {
            const isLeft = index === left;
            const isRight = index === right;
            const isMid = index === mid;
            const isInRange = index >= left && index <= right;
            
            return (
              <div key={index} className="flex flex-col items-center mx-1">
                <div 
                  className={`
                    w-10 h-10 flex items-center justify-center border
                    ${isMid ? 'bg-green-500 text-white' : ''}
                    ${isLeft && !isMid ? 'bg-blue-500 text-white' : ''}
                    ${isRight && !isMid ? 'bg-blue-500 text-white' : ''}
                    ${isInRange && !isLeft && !isRight && !isMid ? 'bg-blue-100' : ''}
                    ${!isInRange ? 'bg-gray-100' : ''}
                  `}
                >
                  {val}
                </div>
                <div className="text-xs mt-1">{index}</div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mb-4">
          {currentStep && (
            <div>
              <p className="text-sm mb-2">
                Searching for: <span className="font-bold">{value}</span>
              </p>
              <p className="text-sm">
                left: {left}, mid: {mid}, right: {right}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 mb-2"></div>
            <span className="text-sm">left/right</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 mb-2"></div>
            <span className="text-sm">mid</span>
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
      {renderBinarySearch()}
    </BaseVisualizer>
  );
}