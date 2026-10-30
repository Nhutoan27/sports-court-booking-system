import { cn } from '../../utils/cn';

export default function Input({
  label,
  icon: Icon,
  rightElement,
  className,
  containerClassName,
  id,
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />}
        <input
          id={id}
          className={cn(
            'w-full rounded-lg border border-outline bg-white py-2.5 text-sm text-ink placeholder:text-ink-soft',
            'transition-shadow duration-150',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            'disabled:bg-surface-variant-2 disabled:text-ink-soft',
            Icon ? 'pl-10' : 'pl-3',
            rightElement ? 'pr-10' : 'pr-3',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

