import { Problem } from './Problem';
import { Attempt } from './Attempt';
import { Feedback } from './Feedback';

/**
 * Strategy interface for evaluating an attempt against a problem.
 *
 * Implementations are pluggable (e.g. a rule-based mock, an LLM-backed
 * evaluator, or a rubric scorer) so the evaluation approach can evolve
 * without touching the rest of the system.
 */
export interface EvaluationStrategy {
  evaluate(problem: Problem, attempt: Attempt): Promise<Feedback>;
}
