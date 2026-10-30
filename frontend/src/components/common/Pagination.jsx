import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex size-9 items-center justify-center rounded-full border border-outline text-ink-muted transition-colors hover:bg-surface-variant-2 disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
            p === page ? 'bg-primary text-white shadow-primary' : 'text-ink-muted hover:bg-surface-variant-2'
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex size-9 items-center justify-center rounded-full border border-outline text-ink-muted transition-colors hover:bg-surface-variant-2 disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

