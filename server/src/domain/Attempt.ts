import { Feedback } from './Feedback';

/**
 * A learner's submitted solution to a Problem and its evaluation lifecycle.
 */

export type SolutionType = 'text' | 'code';

export type AttemptStatus = 'pending' | 'evaluating' | 'completed' | 'failed';

export interface Solution {
  type: SolutionType;
  content: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  learnerId: string;
  submittedAt: string;
  solution: Solution;
  status: AttemptStatus;
  feedback: Feedback | null;
}
