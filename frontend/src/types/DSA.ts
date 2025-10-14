/**
 * DSA Content Types
 */

export interface DSAContent {
  topics: DSATopic[];
}

export interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  explanation: string;
  conceptVideo: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
  };
  practiceQuestions: PracticeQuestion[];
}

export interface PracticeQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialCode: string;
  languageId: number; // Judge0 language ID
  visualizerType: 'linked-list' | 'binary-search' | 'n-queens' | 'dynamic-programming' | 'backtracking' | 'graph';
}

export interface VisualizationStep {
  event: string;
  [key: string]: any; // Additional properties based on visualizer type
}

export interface ExecutionResult {
  success: boolean;
  finalOutput: string;
  visualizationSteps: VisualizationStep[];
  error?: string;
}