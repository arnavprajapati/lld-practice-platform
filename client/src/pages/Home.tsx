import { problems } from '../data/problems';
import type { Difficulty } from '../types';

const difficultyStyle: Record<Difficulty, string> = {
  Easy: 'bg-surface-sunken text-muted',
  Medium: 'bg-surface-sunken text-ink-soft',
  Hard: 'bg-ink text-white',
};

export default function Home() {
  return (
    <section className="space-y-12">
      {/* ── Hero ── */}
      <div className="space-y-4 max-w-2xl">
        <p className="eyebrow">Practice Platform</p>
        <h1 className="text-[40px] leading-[1.1] font-bold tracking-tight">
          Master Low-Level Design
        </h1>
        <p className="text-base leading-relaxed text-muted">
          Work through real system-design problems, submit your solution, and
          get structured feedback on design principles.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="flex gap-8">
        <div className="space-y-1">
          <p className="text-[28px] font-bold tracking-tight">{problems.length}</p>
          <p className="text-[13px] text-faint">Problems</p>
        </div>
        <div className="w-px bg-line" />
        <div className="space-y-1">
          <p className="text-[28px] font-bold tracking-tight">3</p>
          <p className="text-[13px] text-faint">Difficulty levels</p>
        </div>
        <div className="w-px bg-line" />
        <div className="space-y-1">
          <p className="text-[28px] font-bold tracking-tight">5</p>
          <p className="text-[13px] text-faint">Design principles</p>
        </div>
      </div>

      {/* ── Divider ── */}
      <hr className="border-line" />

      {/* ── Problem cards ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">All Problems</h2>
          <p className="text-[13px] text-faint">{problems.length} available</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.id}
              className="group flex flex-col rounded-card border border-line bg-surface p-5 shadow-soft hover:shadow-card hover:border-line-strong"
            >
              {/* Category + difficulty */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-faint uppercase tracking-wider">
                  {problem.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-[11px] font-medium ${difficultyStyle[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold leading-snug mb-2">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] leading-relaxed text-muted mb-4 line-clamp-3 flex-1">
                {problem.description}
              </p>

              {/* Requirements count + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-line">
                <span className="text-[12px] text-faint">
                  {problem.requirements.length} requirements
                </span>
                <button className="rounded-btn bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-ink-soft">
                  Start →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
