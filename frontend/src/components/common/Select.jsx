import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Select({ label, icon: Icon, className, containerClassName, id, children, ...props }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />}
        <select
          id={id}
          className={cn(
            'w-full appearance-none rounded-lg border border-outline bg-white py-2.5 pr-9 text-sm text-ink transition-shadow duration-150',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            'disabled:bg-surface-variant-2 disabled:text-ink-soft',
            Icon ? 'pl-10' : 'px-3',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
      </div>
    </div>
  );
}

