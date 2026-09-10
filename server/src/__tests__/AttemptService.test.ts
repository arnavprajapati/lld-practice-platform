import { AttemptService } from '../services/AttemptService';
import { AttemptRepository } from '../services/AttemptRepository';
import { ProblemRepository } from '../services/ProblemRepository';
import { EvaluationStrategy, Feedback } from '../domain';

describe('AttemptService', () => {
  let attemptRepo: AttemptRepository;
  let problemRepo: ProblemRepository;
  let mockEvaluator: jest.Mocked<EvaluationStrategy>;
  let service: AttemptService;

  const sampleFeedback: Feedback = {
    overallScore: 85,
    summary: 'Great design',
    strengths: ['Good encapsulation'],
    improvements: ['Consider scalability'],
    designPrinciples: [
      { name: 'Single Responsibility', met: true, comment: 'Well separated' },
    ],
  };

  beforeEach(() => {
    attemptRepo = new AttemptRepository();
    problemRepo = new ProblemRepository();
    mockEvaluator = {
      evaluate: jest.fn(),
    };
    service = new AttemptService(attemptRepo, problemRepo, mockEvaluator);
  });

  test('creates attempt and enters evaluating status asynchronously', () => {
    mockEvaluator.evaluate.mockImplementation(() => new Promise(() => {})); // never resolves immediately

    const attempt = service.createAttempt('parking-lot', {
      type: 'text',
      content: 'My parking lot solution',
    });

    expect(attempt).toBeDefined();
    expect(attempt.id).toBeDefined();
    expect(['pending', 'evaluating']).toContain(attempt.status);
    expect(attempt.problemId).toBe('parking-lot');
    expect(attempt.learnerId).toBe('user-1');
  });

  test('calls EvaluationStrategy with correct problem and attempt and updates status to completed', async () => {
    mockEvaluator.evaluate.mockResolvedValue(sampleFeedback);

    const attempt = service.createAttempt('parking-lot', {
      type: 'code',
      content: 'class ParkingLot {}',
    });

    // Wait for async background evaluation to complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockEvaluator.evaluate).toHaveBeenCalledTimes(1);
    const [passedProblem, passedAttempt] = mockEvaluator.evaluate.mock.calls[0];
    expect(passedProblem.id).toBe('parking-lot');
    expect(passedAttempt.id).toBe(attempt.id);

    const updated = service.getAttempt(attempt.id);
    expect(updated?.status).toBe('completed');
    expect(updated?.feedback).toEqual(sampleFeedback);
  });

  test('updates attempt to failed if EvaluationStrategy throws error', async () => {
    // Suppress console.error during expected failure test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockEvaluator.evaluate.mockRejectedValue(new Error('AI service error'));

    const attempt = service.createAttempt('parking-lot', {
      type: 'text',
      content: 'Some solution',
    });

    // Wait for async background evaluation
    await new Promise((resolve) => setTimeout(resolve, 50));

    const updated = service.getAttempt(attempt.id);
    expect(updated?.status).toBe('failed');
    expect(updated?.feedback).toBeNull();

    spy.mockRestore();
  });

  // Edge cases
  describe('Edge cases', () => {
    test('throws error when submitting to non-existent problemId', () => {
      expect(() => {
        service.createAttempt('invalid-problem-id', {
          type: 'text',
          content: 'Solution',
        });
      }).toThrow('Problem not found: invalid-problem-id');
    });

    test('handles empty solution content gracefully', async () => {
      mockEvaluator.evaluate.mockResolvedValue(sampleFeedback);

      const attempt = service.createAttempt('parking-lot', {
        type: 'text',
        content: '',
      });

      expect(['pending', 'evaluating']).toContain(attempt.status);
      expect(attempt.solution.content).toBe('');

      await new Promise((resolve) => setTimeout(resolve, 50));

      const updated = service.getAttempt(attempt.id);
      expect(updated?.status).toBe('completed');
    });

    test('handles evaluation strategy throwing unexpected non-Error object', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockEvaluator.evaluate.mockRejectedValue('String exception');

      const attempt = service.createAttempt('parking-lot', {
        type: 'text',
        content: 'Solution',
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      const updated = service.getAttempt(attempt.id);
      expect(updated?.status).toBe('failed');

      spy.mockRestore();
    });
  });
});

