import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProblems } from '../lib/api';
import type { Difficulty } from '../types';

interface ProblemSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
}

const difficultyStyle: Record<Difficulty, string> = {
  Easy: 'bg-surface-sunken text-muted',
  Medium: 'bg-surface-sunken text-ink-soft',
  Hard: 'bg-ink text-white',
};

export default function Home() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems()
      .then(setProblems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3 max-w-2xl">
          <p className="eyebrow">Practice Platform</p>
          <h1 className="text-[40px] leading-[1.1] font-bold tracking-tight">
            Master Low-Level Design
          </h1>
          <p className="text-base leading-relaxed text-muted">
            Pick a problem, write your design, and get structured feedback on
            classes, responsibilities, and design principles.
          </p>
        </div>
        <Link
          to="/history"
          className="rounded-btn border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink hover:border-line-strong"
        >
          My Attempts
        </Link>
      </div>

      <hr className="border-line" />

      {/* Problem cards */}
      {loading ? (
        <p className="text-sm text-faint">Loading problems…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="group flex flex-col rounded-card border border-line bg-surface p-5 shadow-soft hover:shadow-card hover:border-line-strong"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-faint uppercase tracking-wider">
                  {p.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-[11px] font-medium ${difficultyStyle[p.difficulty]}`}
                >
                  {p.difficulty}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug mb-2">
                {p.title}
              </h3>
              <div className="mt-auto pt-3 border-t border-line">
                <span className="text-[12px] font-medium text-muted group-hover:text-ink">
                  Start solving →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
