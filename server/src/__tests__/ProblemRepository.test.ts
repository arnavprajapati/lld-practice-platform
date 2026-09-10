import { ProblemRepository } from '../services/ProblemRepository';

describe('ProblemRepository', () => {
  let repo: ProblemRepository;

  beforeEach(() => {
    repo = new ProblemRepository();
  });

  test('returns all 3 seeded problems', () => {
    const problems = repo.findAll();
    expect(problems).toHaveLength(3);
    const ids = problems.map((p) => p.id);
    expect(ids).toContain('parking-lot');
    expect(ids).toContain('library-management');
    expect(ids).toContain('food-delivery');
  });

  test('returns correct problem by id', () => {
    const problem = repo.findById('parking-lot');
    expect(problem).toBeDefined();
    expect(problem?.title).toBe('Parking Lot System');
    expect(problem?.difficulty).toBe('Medium');
  });

  test('returns undefined for unknown id', () => {
    const problem = repo.findById('non-existent-id');
    expect(problem).toBeUndefined();
  });
});

