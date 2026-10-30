import { cn } from '../../utils/cn';

export default function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 overflow-x-auto rounded-full border border-outline-variant bg-surface-variant-2 p-1',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors',
            value === option.value ? 'bg-white text-primary shadow-card' : 'text-ink-muted hover:text-ink'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

