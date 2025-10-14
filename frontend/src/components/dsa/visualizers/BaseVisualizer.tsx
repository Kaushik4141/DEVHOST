'use client';

import { useState, useEffect } from 'react';
import { VisualizationStep } from '@/types/DSA';
import { Button } from '@/components/UI/button';
import { Slider } from '@/components/documentation/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface BaseVisualizerProps {
  visualizationSteps: VisualizationStep[];
  isRunning: boolean;
  className?: string;
}

export default function BaseVisualizer({
  visualizationSteps,
  isRunning,
  className,
  children,
}: BaseVisualizerProps & { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // seconds per step

  const hasSteps = visualizationSteps.length > 0;
  const currentStep = hasSteps ? visualizationSteps[currentStepIndex] : null;
  
  // Reset to first step when new visualization steps are received
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [visualizationSteps]);

  // Handle auto-play
  useEffect(() => {
    if (!hasSteps || !isPlaying || isRunning) return;
    
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= visualizationSteps.length - 1) {
          setIsPlaying(false);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, playbackSpeed * 1000);
    
    return () => clearInterval(interval);
  }, [hasSteps, isPlaying, isRunning, visualizationSteps, playbackSpeed]);

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
  }

  function handlePrevStep() {
    setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }

  function handleNextStep() {
    setCurrentStepIndex((prevIndex) => 
      Math.min(visualizationSteps.length - 1, prevIndex + 1)
    );
  }

  function handleSliderChange(value: number[]) {
    setCurrentStepIndex(value[0]);
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-grow overflow-auto border rounded-t-lg p-4 bg-white">
        {isRunning ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Running code...</p>
          </div>
        ) : !hasSteps ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Run your code to see the visualization</p>
          </div>
        ) : (
          <div className="h-full">
            {children}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-x border-b rounded-b-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevStep}
              disabled={!hasSteps || currentStepIndex === 0 || isRunning}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePlayPause}
              disabled={!hasSteps || isRunning}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNextStep}
              disabled={!hasSteps || currentStepIndex === visualizationSteps.length - 1 || isRunning}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-slate-400">
            {hasSteps ? `Step ${currentStepIndex + 1} of ${visualizationSteps.length}` : 'No steps'}
          </div>
        </div>
        
        <div className="pt-2">
          <Slider
            value={[currentStepIndex]}
            min={0}
            max={Math.max(0, visualizationSteps.length - 1)}
            step={1}
            onValueChange={handleSliderChange}
            disabled={!hasSteps || isRunning}
          />
        </div>
      </div>
    </div>
  );
}