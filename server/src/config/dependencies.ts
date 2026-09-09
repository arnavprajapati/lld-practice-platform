import { ProblemRepository } from '../services/ProblemRepository';
import { AttemptRepository } from '../services/AttemptRepository';
import { AttemptService } from '../services/AttemptService';
import { MockEvaluationStrategy } from '../services/MockEvaluationStrategy';
import { ProblemController } from '../controllers/problemController';
import { AttemptController } from '../controllers/attemptController';

const problemRepo = new ProblemRepository();
const attemptRepo = new AttemptRepository();
const evaluator = new MockEvaluationStrategy();
const attemptService = new AttemptService(attemptRepo, problemRepo, evaluator);

export const problemController = new ProblemController(problemRepo);
export const attemptController = new AttemptController(attemptService);