import { cn } from '../../utils/cn';

export default function Textarea({ label, className, containerClassName, id, ...props }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft transition-shadow duration-150',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
          className
        )}
        {...props}
      />
    </div>
  );
}

