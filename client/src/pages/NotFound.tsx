import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
      <p className="text-[64px] font-bold tracking-tight text-ink">404</p>
      <h1 className="text-xl font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-muted max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-btn bg-ink px-5 py-2.5 text-[13px] font-medium text-white hover:bg-ink-soft"
      >
        Back home
      </Link>
    </section>
  );
}
