import { CircleCheck } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function SkillLevelCard({ level, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(level.value)}
      className={cn(
        'relative rounded-lg border p-4 text-left transition-colors',
        selected ? 'border-primary bg-primary-container/40 shadow-primary' : 'border-outline bg-white hover:border-primary/40 hover:bg-surface-variant-2'
      )}
    >
      {selected && <CircleCheck className="absolute right-3 top-3 size-5 text-primary" />}
      <p className="font-semibold text-ink">{level.label}</p>
      <p className="mt-1 text-sm text-ink-muted">{level.description}</p>
    </button>
  );
}

