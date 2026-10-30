import { cn } from '../../utils/cn';

export default function ProgressBar({ value, className, barClassName }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-variant-2', className)}>
      <div
        className={cn('h-full rounded-full bg-primary transition-all', barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

