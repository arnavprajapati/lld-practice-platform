import { Attempt, Problem } from '../domain';
import { seedProblems } from './seedProblems';

/**
 * In-memory data store for the platform.
 *
 * Backed by plain Maps — no database. State lives for the lifetime of the
 * process and is re-seeded on startup. A single shared instance is exported
 * as `store` below.
 */
class InMemoryStore {
  private readonly problems = new Map<string, Problem>();
  private readonly attempts = new Map<string, Attempt>();

  constructor() {
    this.seed();
  }

  /** Load the initial problem set into memory. */
  private seed(): void {
    for (const problem of seedProblems) {
      this.problems.set(problem.id, problem);
    }
  }

  // --- Problems -----------------------------------------------------------

  getProblems(): Problem[] {
    return [...this.problems.values()];
  }

  getProblem(id: string): Problem | undefined {
    return this.problems.get(id);
  }

  // --- Attempts -----------------------------------------------------------

  getAttempts(): Attempt[] {
    return [...this.attempts.values()];
  }

  getAttempt(id: string): Attempt | undefined {
    return this.attempts.get(id);
  }

  getAttemptsByProblem(problemId: string): Attempt[] {
    return this.getAttempts().filter((a) => a.problemId === problemId);
  }

  /** Insert or replace an attempt. Returns the stored attempt. */
  saveAttempt(attempt: Attempt): Attempt {
    this.attempts.set(attempt.id, attempt);
    return attempt;
  }
}

/** Shared singleton store used across the app. */
export const store = new InMemoryStore();
