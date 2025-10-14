'use client';

import { VisualizationStep } from '@/types/DSA';
import LinkedListVisualizer from './LinkedListVisualizer';
import BinarySearchVisualizer from './BinarySearchVisualizer';

interface VisualizerSelectorProps {
  visualizerType: string;
  visualizationSteps: VisualizationStep[];
  isRunning: boolean;
}

export default function VisualizerSelector({
  visualizerType,
  visualizationSteps,
  isRunning,
}: VisualizerSelectorProps) {
  // Select the appropriate visualizer based on the type
  switch (visualizerType) {
    case 'linked-list':
      return (
        <LinkedListVisualizer
          visualizationSteps={visualizationSteps}
          isRunning={isRunning}
        />
      );
    case 'binary-search':
      return (
        <BinarySearchVisualizer
          visualizationSteps={visualizationSteps}
          isRunning={isRunning}
        />
      );
    // Add more visualizer types as they are implemented
    default:
      // Fallback to a generic visualizer or message
      return (
        <div className="flex items-center justify-center h-full border border-white/10 bg-black/30 rounded-lg p-4">
          <p className="text-slate-400">
            {isRunning ? (
              'Running code...'
            ) : visualizationSteps.length > 0 ? (
              `Visualization for ${visualizerType} is not yet implemented`
            ) : (
              'Run your code to see the visualization'
            )}
          </p>
        </div>
      );
  }
}