import { cn } from '../../../utils/cn';

const STATUS_CLASSES = {
  available: 'border-outline bg-white text-ink hover:border-success hover:bg-success/5',
  booked: 'border-outline-variant bg-surface-variant-2 text-ink-soft line-through cursor-not-allowed',
  selected: 'border-primary bg-primary text-white shadow-primary scale-[1.02]',
};

export default function TimeSlotGrid({ periods, onToggle }) {
  return (
    <div className="space-y-6">
      {Object.entries(periods).map(([period, slots]) => (
        <div key={period}>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            {period}
            <span className="h-px flex-1 bg-outline-variant" />
          </h4>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={slot.status === 'booked'}
                onClick={() => onToggle?.(slot.id)}
                className={cn(
                  'rounded-lg border py-3 text-sm font-semibold transition-all',
                  STATUS_CLASSES[slot.status]
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

