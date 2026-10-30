import { cn } from '../../utils/cn';

export default function Card({ as: Component = 'div', className, children, padded = true, ...props }) {
  return (
    <Component
      className={cn(
        'bg-white rounded-2xl shadow-soft border border-outline-variant/70',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

