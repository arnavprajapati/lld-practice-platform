import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAttempt } from '../lib/api';
import type { Attempt } from '../types';

function formatText(text: string): string {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

export default function AttemptStatus() {
  const { id } = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;

    const poll = () => {
      fetchAttempt(id)
        .then((data) => {
          setAttempt(data);
          if (data.status === 'completed' || data.status === 'failed') {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        })
        .catch(() => setError('Failed to load attempt'));
    };

    poll(); // initial fetch
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!attempt) return <p className="text-sm text-faint">Loading…</p>;

  const isPending = attempt.status === 'pending' || attempt.status === 'evaluating';
  const isFailed = attempt.status === 'failed';

  // Score color
  const scoreColor =
    (attempt.feedback?.overallScore ?? 0) >= 75
      ? 'text-green-600'
      : (attempt.feedback?.overallScore ?? 0) >= 50
        ? 'text-yellow-600'
        : 'text-red-500';

  return (
    <section className="space-y-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-faint">
        <Link to="/" className="hover:text-ink">Problems</Link>
        <span>/</span>
        <span className="text-muted">Attempt</span>
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="rounded-card border border-line bg-surface p-8 text-center space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken">
            <span className="animate-spin text-lg">⏳</span>
          </div>
          <p className="text-[15px] font-medium text-ink">Evaluating your design…</p>
          <p className="text-[13px] text-muted">
            The AI is reviewing your solution against design principles. This takes a few seconds.
          </p>
          <span className="inline-flex items-center rounded-badge bg-surface-sunken px-3 py-1 text-[12px] font-medium text-muted">
            {attempt.status}
          </span>
        </div>
      )}

      {/* Failed state */}
      {isFailed && (
        <div className="rounded-card border border-line bg-surface p-8 text-center space-y-3">
          <p className="text-[15px] font-medium text-red-500">Evaluation failed</p>
          <p className="text-[13px] text-muted">
            Something went wrong during evaluation. Please try again.
          </p>
          <Link
            to={`/problems/${attempt.problemId}`}
            className="inline-block rounded-btn bg-ink px-4 py-2 text-[13px] font-medium text-white hover:bg-ink-soft"
          >
            Try Again
          </Link>
        </div>
      )}

      {/* Completed — show feedback */}
      {attempt.status === 'completed' && attempt.feedback && (
        <div className="space-y-6">
          {/* Score */}
          <div className="rounded-card border border-line bg-surface p-6 flex items-center gap-6">
            <div className="text-center">
              <p className={`text-[48px] font-bold tracking-tight ${scoreColor}`}>
                {attempt.feedback.overallScore}
              </p>
              <p className="text-[12px] text-faint">Overall Score</p>
            </div>
            <div className="flex-1 border-l border-line pl-6">
              <p className="text-[14px] leading-relaxed text-ink-soft">
                {formatText(attempt.feedback.summary)}
              </p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-card border border-line bg-surface p-5 space-y-3">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-green-600">
                Strengths
              </h3>
              <ul className="space-y-2">
                {attempt.feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {formatText(s)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="rounded-card border border-line bg-surface p-5 space-y-3">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-yellow-600">
                Improvements
              </h3>
              <ul className="space-y-2">
                {attempt.feedback.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft">
                    <span className="text-yellow-500 mt-0.5">→</span>
                    {formatText(imp)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Design Principles */}
          <div className="rounded-card border border-line bg-surface overflow-hidden">
            <div className="px-5 py-3 border-b border-line bg-surface-sunken">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                Design Principles
              </h3>
            </div>
            <div className="divide-y divide-line">
              {attempt.feedback.designPrinciples.map((dp, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <span className={`mt-0.5 text-[14px] ${dp.met ? 'text-green-500' : 'text-red-400'}`}>
                    {dp.met ? '●' : '○'}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-ink">{formatText(dp.name)}</p>
                    <p className="text-[12px] text-muted mt-0.5">{formatText(dp.comment)}</p>
                  </div>
                  <span
                    className={`rounded-badge px-2 py-0.5 text-[11px] font-medium ${
                      dp.met ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {dp.met ? 'Met' : 'Not Met'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to={`/problems/${attempt.problemId}`}
              className="rounded-btn bg-ink px-4 py-2 text-[13px] font-medium text-white hover:bg-ink-soft"
            >
              Try Again
            </Link>
            <Link
              to="/history"
              className="rounded-btn border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink hover:border-line-strong"
            >
              View All Attempts
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
