import { Request, Response } from 'express';
import { AttemptService } from '../services/AttemptService';

/**
 * Thin controller — delegates to AttemptService, shapes the HTTP response.
 */
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  /** POST /api/attempts — create attempt, return id immediately. */
  create = (req: Request, res: Response): void => {
    const { problemId, solution } = req.body;

    if (!problemId || !solution?.type || !solution?.content) {
      res.status(400).json({ error: 'Missing required fields: problemId, solution.type, solution.content' });
      return;
    }

    if (!['text', 'code'].includes(solution.type)) {
      res.status(400).json({ error: 'solution.type must be "text" or "code"' });
      return;
    }

    try {
      const attempt = this.attemptService.createAttempt(problemId, solution);
      res.status(201).json({ id: attempt.id, status: attempt.status });
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  /** GET /api/attempts/:id — return attempt with status and feedback if ready. */
  getById = (req: Request, res: Response): void => {
    const attempt = this.attemptService.getAttempt(req.params.id);
    if (!attempt) {
      res.status(404).json({ error: 'Attempt not found' });
      return;
    }
    res.json(attempt);
  };

  /** GET /api/attempts/history/all — all attempts for "user-1", newest first. */
  getHistory = (_req: Request, res: Response): void => {
    const history = this.attemptService.getHistory('user-1');
    res.json(history);
  };
}

