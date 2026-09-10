import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHistory } from '../lib/api';
import type { Attempt } from '../types';

type AttemptWithTitle = Attempt & { problemTitle: string };

const statusStyle: Record<string, string> = {
  pending: 'bg-surface-sunken text-muted',
  evaluating: 'bg-surface-sunken text-muted',
  completed: 'bg-green-50 text-green-600',
  failed: 'bg-red-50 text-red-500',
};

export default function History() {
  const [attempts, setAttempts] = useState<AttemptWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setAttempts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold tracking-tight">My Attempts</h1>
          <p className="text-[14px] text-muted">
            All your submitted solutions, newest first.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-btn border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink hover:border-line-strong"
        >
          ← Back to Problems
        </Link>
      </div>

      <hr className="border-line" />

      {loading ? (
        <p className="text-sm text-faint">Loading…</p>
      ) : attempts.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center space-y-3">
          <p className="text-[15px] font-medium text-ink">No attempts yet</p>
          <p className="text-[13px] text-muted">Pick a problem and submit your first solution.</p>
          <Link
            to="/"
            className="inline-block rounded-btn bg-ink px-4 py-2 text-[13px] font-medium text-white hover:bg-ink-soft"
          >
            Browse Problems
          </Link>
        </div>
      ) : (
        <div className="rounded-card border border-line bg-surface overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_160px_80px_100px] gap-4 px-5 py-3 border-b border-line bg-surface-sunken text-[12px] font-medium uppercase tracking-wider text-faint">
            <span>Problem</span>
            <span>Submitted</span>
            <span>Score</span>
            <span>Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-line">
            {attempts.map((a) => (
              <Link
                key={a.id}
                to={`/attempts/${a.id}`}
                className="grid grid-cols-[1fr_160px_80px_100px] gap-4 px-5 py-3.5 items-center hover:bg-surface-sunken"
              >
                <span className="text-[14px] font-medium text-ink truncate">
                  {a.problemTitle}
                </span>
                <span className="text-[13px] text-muted">
                  {formatDate(a.submittedAt)}
                </span>
                <span className="text-[14px] font-semibold text-ink">
                  {a.feedback?.overallScore ?? '—'}
                </span>
                <span
                  className={`inline-flex w-fit items-center rounded-badge px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[a.status] ?? ''}`}
                >
                  {a.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

