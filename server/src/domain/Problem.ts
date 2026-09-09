/**
 * A Low-Level Design problem that a learner attempts to solve.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/**
 * A concrete scenario that illustrates how the designed system should behave.
 * For LLD problems these are behavioural examples rather than strict I/O pairs.
 */
export interface Example {
  title: string;
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  difficulty: Difficulty;
  category: string;
  examples: Example[];
}
