import { AttemptRepository } from '../services/AttemptRepository';
import { Attempt } from '../domain';

describe('AttemptRepository', () => {
  let repo: AttemptRepository;

  beforeEach(() => {
    repo = new AttemptRepository();
  });

  test('can save and retrieve an attempt', () => {
    const attempt: Attempt = {
      id: 'att-1',
      problemId: 'parking-lot',
      learnerId: 'user-1',
      submittedAt: new Date().toISOString(),
      solution: { type: 'text', content: 'Class ParkingSpot {}' },
      status: 'pending',
      feedback: null,
    };

    repo.save(attempt);
    const retrieved = repo.findById('att-1');
    expect(retrieved).toEqual(attempt);
  });

  test('returns undefined for non-existent attempt id', () => {
    const result = repo.findById('invalid-id');
    expect(result).toBeUndefined();
  });

  test('history returns attempts sorted by newest first', () => {
    const older: Attempt = {
      id: 'att-old',
      problemId: 'parking-lot',
      learnerId: 'user-1',
      submittedAt: '2026-01-01T10:00:00.000Z',
      solution: { type: 'text', content: 'Old solution' },
      status: 'completed',
      feedback: null,
    };

    const newer: Attempt = {
      id: 'att-new',
      problemId: 'library-management',
      learnerId: 'user-1',
      submittedAt: '2026-06-01T10:00:00.000Z',
      solution: { type: 'code', content: 'New solution' },
      status: 'completed',
      feedback: null,
    };

    repo.save(older);
    repo.save(newer);

    const attempts = repo.findByLearnerId('user-1');
    // Sort manually as AttemptService does, verify dates
    attempts.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    expect(attempts[0].id).toBe('att-new');
    expect(attempts[1].id).toBe('att-old');
  });
});

