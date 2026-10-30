import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Stepper({ steps, activeIndex, className }) {
  return (
    <ol className={cn('flex items-center', className)}>
      {steps.map((label, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const last = i === steps.length - 1;

        return (
          <li key={label} className={cn('flex items-center', !last && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-8',
                  done && 'bg-primary text-white',
                  active && 'bg-primary text-white ring-4 ring-primary-container',
                  !done && !active && 'bg-surface-variant-2 text-ink-soft'
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-center text-xs font-medium sm:block',
                  active ? 'text-ink' : done ? 'text-ink-muted' : 'text-ink-soft'
                )}
              >
                {label}
              </span>
            </div>
            {!last && (
              <span className={cn('mx-2 h-0.5 flex-1 rounded-full transition-colors sm:mx-3', done ? 'bg-primary' : 'bg-surface-variant-2')} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

