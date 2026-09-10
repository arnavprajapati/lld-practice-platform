const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/** GET /api/problems — summary list */
export async function fetchProblems() {
  const res = await fetch(`${BASE_URL}/api/problems`);
  if (!res.ok) throw new Error('Failed to fetch problems');
  return res.json();
}

/** GET /api/problems/:id — full detail */
export async function fetchProblem(id: string) {
  const res = await fetch(`${BASE_URL}/api/problems/${id}`);
  if (!res.ok) throw new Error('Problem not found');
  return res.json();
}

/** POST /api/attempts — submit solution */
export async function submitAttempt(problemId: string, solution: { type: 'text' | 'code'; content: string }) {
  const res = await fetch(`${BASE_URL}/api/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId, solution }),
  });
  if (!res.ok) throw new Error('Failed to submit attempt');
  return res.json();
}

/** GET /api/attempts/:id — status + feedback */
export async function fetchAttempt(id: string) {
  const res = await fetch(`${BASE_URL}/api/attempts/${id}`);
  if (!res.ok) throw new Error('Attempt not found');
  return res.json();
}

/** GET /api/attempts/history/all — all attempts for user-1 */
export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/api/attempts/history/all`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

