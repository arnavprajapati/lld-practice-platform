import express from 'express';
import cors from 'cors';
import { store } from './services/store';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', problems: store.getProblems().length });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Seeded ${store.getProblems().length} LLD problems`);
});
