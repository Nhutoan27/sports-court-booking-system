import { useState } from 'react';
import { Calendar, ListFilter, Sunrise, Sun, Sunset, RotateCcw } from 'lucide-react';
import Card from '../../../components/common/Card';
import { cn } from '../../../utils/cn';

const PERIODS = [
  { value: 'any', label: 'Bất kỳ', icon: ListFilter },
  { value: 'morning', label: 'Sáng', icon: Sunrise },
  { value: 'afternoon', label: 'Chiều', icon: Sun },
  { value: 'evening', label: 'Tối', icon: Sunset },
];

export default function SearchFilterBar({ sports = [], value, onChange }) {
  const [local, setLocal] = useState(value);

  const update = (patch) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange?.(next);
  };

  const reset = () => {
    const cleared = { sportId: 'all', date: '', timeSlot: 'any' };
    setLocal(cleared);
    onChange?.(cleared);
  };

  return (
    <Card className="lg:sticky lg:top-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
          <ListFilter className="size-4 text-primary" />
          Bộ lọc
        </h3>
        <button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-primary">
          <RotateCcw className="size-3.5" />
          Xoá lọc
        </button>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Môn thể thao</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ sportId: 'all' })}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
              local.sportId === 'all' ? 'border-primary bg-primary-container text-primary-on-container' : 'border-outline text-ink-muted hover:border-primary/40 hover:text-ink'
            )}
          >
            Tất cả
          </button>
          {sports.map((sport) => (
            <button
              key={sport.id}
              type="button"
              onClick={() => update({ sportId: sport.id })}
              className={cn(
                'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                String(local.sportId) === String(sport.id)
                  ? 'border-primary bg-primary-container text-primary-on-container'
                  : 'border-outline text-ink-muted hover:border-primary/40 hover:text-ink'
              )}
            >
              {sport.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Calendar className="size-3.5" />
          Ngày chơi
        </p>
        <input
          type="date"
          value={local.date}
          onChange={(e) => update({ date: e.target.value })}
          className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-ink transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Buổi</p>
        <div className="grid grid-cols-2 gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => update({ timeSlot: p.value })}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                local.timeSlot === p.value ? 'border-primary bg-primary-container text-primary-on-container' : 'border-outline text-ink-muted hover:border-primary/40 hover:text-ink'
              )}
            >
              <p.icon className="size-3.5" />
              {p.label}
            </button>
          ))}
        </div>
        {!local.date && <p className="mt-2 text-xs text-ink-soft">Chọn ngày trước để lọc theo buổi.</p>}
      </div>
    </Card>
  );
}

