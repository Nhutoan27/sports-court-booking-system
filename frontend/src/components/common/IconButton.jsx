import { cn } from '../../utils/cn';

const VARIANTS = {
  ghost: 'text-ink-muted hover:bg-surface-variant-2',
  outline: 'text-ink-muted border border-outline hover:bg-surface-variant-2',
  filled: 'bg-primary text-white hover:bg-primary-hover',
};

export default function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className,
  label,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-11' : 'size-9';
  const iconSizeClass = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors',
        sizeClass,
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      <Icon className={iconSizeClass} />
    </button>
  );
}

