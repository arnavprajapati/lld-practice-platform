import express from 'express';
import cors from 'cors';
import { problemController, attemptController } from './config/dependencies';
import { createProblemRoutes } from './routes/problemRoutes';
import { createAttemptRoutes } from './routes/attemptRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/problems', createProblemRoutes(problemController));
app.use('/api/attempts', createAttemptRoutes(attemptController));

export default app;