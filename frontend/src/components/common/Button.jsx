import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'bg-primary text-white shadow-primary hover:bg-primary-hover hover:shadow-primary-lg disabled:bg-outline disabled:text-white/70 disabled:shadow-none',
  accent: 'bg-warning text-white shadow-primary hover:bg-warning-dark hover:shadow-primary-lg disabled:bg-outline disabled:text-white/70 disabled:shadow-none',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark disabled:bg-outline disabled:text-white/70',
  outline: 'bg-white text-ink border border-outline hover:bg-surface-variant-2 disabled:text-ink-soft disabled:bg-white',
  'outline-primary': 'bg-white text-primary border border-primary hover:bg-primary-container/40 disabled:text-ink-soft disabled:border-outline',
  ghost: 'bg-transparent text-ink hover:bg-surface-variant-2 disabled:text-ink-soft',
  danger: 'bg-danger-container text-danger-on-container hover:bg-danger/20 disabled:opacity-50',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'transition-[background-color,box-shadow,transform] duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
        !disabled && 'active:scale-[0.98]',
        rounded === 'full' ? 'rounded-full' : 'rounded-lg',
        VARIANTS[variant],
        SIZES[size],
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="size-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="size-4" />}
    </Component>
  );
}

