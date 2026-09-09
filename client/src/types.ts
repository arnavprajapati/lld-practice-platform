/**
 * Client-side domain types, mirrored from the server's domain models
 * (server/src/domain). Kept in sync manually since this is a frontend-only
 * build with no shared package.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

/** A behavioural scenario illustrating how the designed system should act. */
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

export type SolutionType = "text" | "code";

export type AttemptStatus = "pending" | "evaluating" | "completed" | "failed";

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

/** How well an attempt honoured a particular design principle. */
export interface DesignPrinciple {
  name: string;
  met: boolean;
  comment: string;
}

export interface Feedback {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  designPrinciples: DesignPrinciple[];
}
