import { Attempt } from '../domain';

/**
 * In-memory repository for Attempt entities.
 * State lives for the lifetime of the process.
 */
export class AttemptRepository {
  private readonly attempts = new Map<string, Attempt>();

  findAll(): Attempt[] {
    return [...this.attempts.values()];
  }

  findById(id: string): Attempt | undefined {
    return this.attempts.get(id);
  }

  findByLearnerId(learnerId: string): Attempt[] {
    return this.findAll().filter((a) => a.learnerId === learnerId);
  }

  findByProblemId(problemId: string): Attempt[] {
    return this.findAll().filter((a) => a.problemId === problemId);
  }

  /** Insert or replace an attempt. Returns the stored attempt. */
  save(attempt: Attempt): Attempt {
    this.attempts.set(attempt.id, attempt);
    return attempt;
  }
}

