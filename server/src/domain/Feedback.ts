/**
 * Structured evaluation of a learner's attempt, produced by an EvaluationStrategy.
 */

/**
 * How well the attempt honoured a particular design principle
 * (e.g. Single Responsibility, Open/Closed, appropriate abstraction).
 */
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
