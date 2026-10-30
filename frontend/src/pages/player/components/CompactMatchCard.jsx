import { Clock, UserPlus } from 'lucide-react';
import Avatar from '../../../components/common/Avatar';
import { cn } from '../../../utils/cn';

export default function CompactMatchCard({ match, onInvite, invited }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-white p-4 shadow-card transition-shadow hover:shadow-soft">
      <Avatar src={match.avatarUrl} name={match.name} size="md" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-semibold text-ink">{match.name}</h4>
          <span className="text-sm font-bold text-primary">{match.matchPercent}%</span>
        </div>
        <p className="text-sm text-ink-muted">{match.level}</p>
        {match.schedule && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="size-3" />
            {match.schedule}
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label={invited ? `Đã mời ${match.name}` : `Mời ${match.name}`}
        disabled={invited}
        onClick={onInvite}
        className={cn('rounded-full p-1.5 transition-colors', invited ? 'text-primary' : 'text-ink-soft hover:bg-primary-container hover:text-primary')}
      >
        <UserPlus className="size-4" />
      </button>
    </div>
  );
}

