import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProblem, submitAttempt } from '../lib/api';
import type { Problem } from '../types';

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [solutionType, setSolutionType] = useState<'text' | 'code'>('text');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchProblem(id)
      .then(setProblem)
      .catch(() => setError('Problem not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await submitAttempt(id, { type: solutionType, content });
      navigate(`/attempts/${result.id}`);
    } catch {
      setError('Failed to submit. Is the server running?');
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-faint">Loading…</p>;
  if (error && !problem) return <p className="text-sm text-red-500">{error}</p>;
  if (!problem) return null;

  const difficultyStyle =
    problem.difficulty === 'Hard'
      ? 'bg-ink text-white'
      : problem.difficulty === 'Medium'
        ? 'bg-surface-sunken text-ink-soft'
        : 'bg-surface-sunken text-muted';

  return (
    <section className="space-y-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-faint">
        <Link to="/" className="hover:text-ink">Problems</Link>
        <span>/</span>
        <span className="text-muted">{problem.title}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold tracking-tight">{problem.title}</h1>
          <span className={`rounded-badge px-2.5 py-0.5 text-[11px] font-medium ${difficultyStyle}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-[15px] leading-relaxed text-muted">{problem.description}</p>
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        <h2 className="text-[15px] font-semibold">Requirements</h2>
        <ul className="space-y-2">
          {problem.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-line bg-surface-sunken text-[11px] text-faint">
                {i + 1}
              </span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      {problem.examples.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[15px] font-semibold">Examples</h2>
          <div className="space-y-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-card border border-line bg-surface-sunken p-4">
                <p className="text-[13px] font-medium mb-1">{ex.title}</p>
                <p className="text-[13px] text-muted">{ex.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-line" />

      {/* Solution input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Your Solution</h2>
          <div className="flex rounded-btn border border-line overflow-hidden text-[12px] font-medium">
            <button
              onClick={() => setSolutionType('text')}
              className={`px-3 py-1.5 ${solutionType === 'text' ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'}`}
            >
              Text
            </button>
            <button
              onClick={() => setSolutionType('code')}
              className={`px-3 py-1.5 border-l border-line ${solutionType === 'code' ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'}`}
            >
              Code
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Write your LLD solution — classes, responsibilities, relationships, and key decisions"
          className={`w-full rounded-card border border-line bg-surface p-4 text-[14px] leading-relaxed text-ink placeholder:text-faint focus:outline-none focus:border-line-strong ${
            solutionType === 'code' ? 'font-mono text-[13px]' : ''
          }`}
        />

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className="rounded-btn bg-ink px-5 py-2.5 text-[13px] font-medium text-white hover:bg-ink-soft disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit Solution'}
        </button>
      </div>
    </section>
  );
}

