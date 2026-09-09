import { v4 as uuidv4 } from 'uuid';
import { Attempt, EvaluationStrategy, Solution } from '../domain';
import { AttemptRepository } from './AttemptRepository';
import { ProblemRepository } from './ProblemRepository';

/**
 * Orchestrates attempt creation and async evaluation.
 * EvaluationStrategy is constructor-injected for extensibility.
 */
export class AttemptService {
  constructor(
    private readonly attemptRepo: AttemptRepository,
    private readonly problemRepo: ProblemRepository,
    private readonly evaluator: EvaluationStrategy,
  ) {}

  /**
   * Create a new attempt and kick off evaluation in the background.
   * Returns the attempt immediately with status 'pending'.
   */
  createAttempt(problemId: string, solution: Solution): Attempt {
    const problem = this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error(`Problem not found: ${problemId}`);
    }

    const attempt: Attempt = {
      id: uuidv4(),
      problemId,
      learnerId: 'user-1', // hardcoded for now
      submittedAt: new Date().toISOString(),
      solution,
      status: 'pending',
      feedback: null,
    };

    this.attemptRepo.save(attempt);

    // Fire-and-forget async evaluation
    this.evaluateInBackground(attempt);

    return attempt;
  }

  getAttempt(id: string): Attempt | undefined {
    return this.attemptRepo.findById(id);
  }

  /** Returns all attempts for a learner, newest first, enriched with problem title. */
  getHistory(learnerId: string): Array<Attempt & { problemTitle: string }> {
    return this.attemptRepo
      .findByLearnerId(learnerId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .map((attempt) => {
        const problem = this.problemRepo.findById(attempt.problemId);
        return { ...attempt, problemTitle: problem?.title ?? 'Unknown' };
      });
  }

  /**
   * Runs evaluation asynchronously. Updates the attempt status
   * to 'evaluating' → 'completed' or 'failed'.
   */
  private async evaluateInBackground(attempt: Attempt): Promise<void> {
    const problem = this.problemRepo.findById(attempt.problemId);
    if (!problem) return;

    try {
      // Mark as evaluating
      attempt.status = 'evaluating';
      this.attemptRepo.save(attempt);

      const feedback = await this.evaluator.evaluate(problem, attempt);

      // Mark as completed with feedback
      attempt.status = 'completed';
      attempt.feedback = feedback;
      this.attemptRepo.save(attempt);
    } catch (err) {
      attempt.status = 'failed';
      this.attemptRepo.save(attempt);
      console.error('Evaluation failed:', err);
    }
  }
}

