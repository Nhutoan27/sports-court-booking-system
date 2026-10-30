import { Ban, Footprints } from 'lucide-react';
import { cn } from '../../../utils/cn';

const CELL_CLASSES = {
  available: 'border border-primary bg-white text-ink',
  booked: 'bg-warning text-white',
  playing: 'bg-primary text-white',
  completed: 'bg-primary-container text-primary-on-container',
  'no-show': 'border-2 border-dashed border-danger bg-danger-container text-danger',
};

function StatusCell({ slot }) {
  if (!slot) {

    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-outline-variant text-xs text-ink-soft">
        Trống
      </div>
    );
  }

  return (
    <div className={cn('flex h-16 w-full flex-col justify-center rounded-lg px-2 text-xs', CELL_CLASSES[slot.status])}>
      {slot.label && (
        <p className={cn('flex items-center gap-1 font-semibold', slot.status === 'no-show' && 'line-through')}>
          {slot.status === 'playing' && <Footprints className="size-3.5" />}
          {slot.status === 'no-show' && <Ban className="size-3.5" />}
          {slot.label}
        </p>
      )}
      {slot.sub && <p className="opacity-80">{slot.sub}</p>}
    </div>
  );
}

export default function CourtStatusGrid({ rows, timeColumns, currentTimeColumn }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant bg-white shadow-card">
      <div
        className="grid"
        style={{ minWidth: `${100 + timeColumns.length * 90}px`, gridTemplateColumns: `100px repeat(${timeColumns.length}, 1fr)` }}
      >
        <div className="border-b border-r border-outline-variant bg-surface-variant-2 px-3 py-3 text-xs font-semibold uppercase text-ink-muted">
          Sân / Giờ
        </div>
        {timeColumns.map((col) => (
          <div
            key={col}
            className={cn(
              'border-b border-r border-outline-variant px-2 py-3 text-center text-xs font-semibold text-ink-muted last:border-r-0',
              col === currentTimeColumn ? 'bg-danger-container/40' : 'bg-surface-variant-2'
            )}
          >
            {col}
          </div>
        ))}

        {rows.map((row) => (
          <div key={row.court} className="contents">
            <div className="flex flex-col justify-center border-b border-r border-outline-variant px-3 py-2">
              <p className="font-display font-bold text-ink">{row.court}</p>
              <p className="text-xs text-ink-muted">{row.type}</p>
            </div>
            {timeColumns.map((col) => (
              <div key={col} className="border-b border-r border-outline-variant p-1 last:border-r-0">
                <StatusCell slot={row.slots[col]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

