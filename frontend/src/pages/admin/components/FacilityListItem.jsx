import Badge from '../../../components/common/Badge';
import { cn } from '../../../utils/cn';
import { sportImage } from '../../../utils/sportImages';

export default function FacilityListItem({ facility, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(facility)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left shadow-card transition-all',
        selected ? 'border-2 border-primary shadow-primary' : 'border-outline-variant hover:border-primary/40 hover:shadow-soft'
      )}
    >
      <img
        src={sportImage(facility.sportName)}
        alt={facility.sportName}
        className="h-16 w-20 shrink-0 rounded-lg object-cover"
      />
      <div>
        <p className="font-semibold text-ink">{facility.name}</p>
        <p className="text-xs text-ink-muted">{facility.sportName}</p>
        <div className="mt-1 flex gap-1.5">
          <Badge color={facility.status === 'ACTIVE' ? 'primary' : 'warning'} variant="soft" className="px-2 py-0.5 text-[10px]">
            {facility.status === 'ACTIVE' ? 'ACTIVE' : facility.status}
          </Badge>
        </div>
      </div>
    </button>
  );
}

