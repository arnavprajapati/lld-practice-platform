import { Request, Response } from 'express';
import { ProblemRepository } from '../services/ProblemRepository';

/**
 * Thin controller — delegates to ProblemRepository, shapes the HTTP response.
 */
export class ProblemController {
  constructor(private readonly problemRepo: ProblemRepository) {}

  /** GET /api/problems — list summary (id, title, difficulty, category). */
  getAll = (_req: Request, res: Response): void => {
    const problems = this.problemRepo.findAll().map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
    }));
    res.json(problems);
  };

  /** GET /api/problems/:id — full detail with requirements & examples. */
  getById = (req: Request, res: Response): void => {
    const problem = this.problemRepo.findById(req.params.id);
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    res.json(problem);
  };
}

