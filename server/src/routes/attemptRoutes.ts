import { Router } from 'express';
import { AttemptController } from '../controllers/attemptController';

export function createAttemptRoutes(controller: AttemptController): Router {
  const router = Router();

  // History must be before :id to avoid "history" being parsed as an id
  router.get('/history/all', controller.getHistory);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);

  return router;
}

