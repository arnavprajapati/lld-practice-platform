import { Problem } from '../domain';
import { seedProblems } from './seedProblems';

/**
 * In-memory repository for Problem entities.
 * Seeded on construction with the 3 starter problems.
 */
export class ProblemRepository {
  private readonly problems = new Map<string, Problem>();

  constructor() {
    for (const p of seedProblems) {
      this.problems.set(p.id, p);
    }
  }

  findAll(): Problem[] {
    return [...this.problems.values()];
  }

  findById(id: string): Problem | undefined {
    return this.problems.get(id);
  }
}

