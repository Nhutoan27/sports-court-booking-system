import { cn } from '../../utils/cn';

const COLOR_VARIANTS = {
  neutral: {
    soft: 'bg-surface-variant-2 text-ink-muted',
    solid: 'bg-ink-soft text-white',
    outline: 'border border-outline text-ink-muted bg-white',
  },
  primary: {
    soft: 'bg-primary-container text-primary-on-container',
    solid: 'bg-primary text-white',
    outline: 'border border-primary text-primary bg-white',
  },
  success: {
    soft: 'bg-success/10 text-success-dark',
    solid: 'bg-success text-white',
    outline: 'border border-success text-success-dark bg-white',
  },
  warning: {
    soft: 'bg-warning-container text-warning-dark',
    solid: 'bg-warning text-white',
    outline: 'border border-warning text-warning-dark bg-white',
  },
  danger: {
    soft: 'bg-danger-container text-danger-on-container',
    solid: 'bg-danger text-white',
    outline: 'border border-danger text-danger bg-white',
  },
};

export default function Badge({ children, color = 'neutral', variant = 'soft', dot = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none',
        COLOR_VARIANTS[color][variant],
        className
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', variant === 'solid' ? 'bg-white' : 'bg-current')} />}
      {children}
    </span>
  );
}

