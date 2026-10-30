import { cn } from '../../../utils/cn';

export default function WeeklyRevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-56 gap-4">
      {data.map((d) => {
        const isPeak = d.value === max;
        return (
          <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              title={d.value.toLocaleString('vi-VN') + 'đ'}
              className={cn(
                'w-full rounded-t-md transition-all duration-300',
                isPeak ? 'bg-primary group-hover:bg-primary-hover' : 'bg-surface-variant-2 group-hover:bg-primary-container'
              )}
              style={{ height: `${max > 0 ? (d.value / max) * 100 : 0}%` }}
            />
            <span className={cn('shrink-0 text-xs transition-colors', isPeak ? 'font-semibold text-ink' : 'text-ink-muted')}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

