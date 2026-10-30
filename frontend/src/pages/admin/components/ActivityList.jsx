import { CirclePlus, CircleX, UserPlus2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

const ICONS = {
  'new-booking': { icon: CirclePlus, tone: 'bg-primary-container text-primary' },
  cancellation: { icon: CircleX, tone: 'bg-danger-container text-danger' },
  signup: { icon: UserPlus2, tone: 'bg-surface-variant-2 text-ink-muted' },
};

export default function ActivityList({ items }) {
  return (
    <ul className="divide-y divide-outline-variant">
      {items.map((item) => {
        const { icon: Icon, tone } = ICONS[item.type];
        return (
          <li key={item.id} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-variant-2/60">
            <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', tone)}>
              <Icon className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="text-sm text-ink-muted">{item.subtitle}</p>
            </div>
            <span className="text-xs text-ink-soft">{item.time}</span>
          </li>
        );
      })}
    </ul>
  );
}

