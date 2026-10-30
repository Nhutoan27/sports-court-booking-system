import { cn } from '../../../utils/cn';

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const SESSIONS = ['Sáng', 'Chiều', 'Tối'];
const SLOT_COUNT = DAYS.length * SESSIONS.length;

function parse(value) {
  const parts = (value ?? '').split(',').map((v) => v.trim());
  if (parts.length !== SLOT_COUNT) return new Array(SLOT_COUNT).fill(0);
  return parts.map((v) => (Number(v) > 0 ? 1 : 0));
}

export default function FreeTimeGrid({ value, onChange }) {
  const slots = parse(value);

  const toggle = (index) => {
    const next = [...slots];
    next[index] = next[index] ? 0 : 1;
    onChange(next.join(','));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-center text-xs">
        <thead>
          <tr>
            <th className="p-1" />
            {DAYS.map((day) => (
              <th key={day} className="p-1 font-semibold text-ink-muted">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SESSIONS.map((session, sessionIndex) => (
            <tr key={session}>
              <td className="p-1 pr-2 text-right font-semibold text-ink-muted">{session}</td>
              {DAYS.map((_, dayIndex) => {
                const index = dayIndex * SESSIONS.length + sessionIndex;
                const active = slots[index] === 1;
                return (
                  <td key={index} className="p-1">
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      aria-pressed={active}
                      className={cn(
                        'size-8 rounded-md border transition-colors',
                        active ? 'border-primary bg-primary' : 'border-outline-variant bg-white hover:bg-surface-variant-2'
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

