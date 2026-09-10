import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProblemDetail from './pages/ProblemDetail';
import AttemptStatus from './pages/AttemptStatus';
import History from './pages/History';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* ── Navigation ── */}
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-[15px] font-semibold tracking-tight">
            LLD Practice
          </Link>
          <div className="flex items-center gap-6 text-[13px] font-medium text-muted">
            <Link to="/" className="hover:text-ink">Problems</Link>
            <Link to="/history" className="hover:text-ink">History</Link>
          </div>
        </nav>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/attempts/:id" element={<AttemptStatus />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
          <p className="text-[12px] text-faint">LLD Practice Platform</p>
          <p className="text-[12px] text-faint">Built for learning low-level design</p>
        </div>
      </footer>
    </div>
  );
}
