import { TrendingUp, CalendarCheck, PieChart, UserX } from 'lucide-react';
import Card from '../../../components/common/Card';
import ProgressBar from '../../../components/common/ProgressBar';
import { cn } from '../../../utils/cn';

const ICONS = { revenue: TrendingUp, bookings: CalendarCheck, occupancy: PieChart, noshows: UserX };

export default function StatCard({ stat }) {
  const Icon = ICONS[stat.key];

  return (
    <Card className="transition-shadow hover:shadow-soft">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-sm text-ink-muted">{stat.label}</p>
        <span className={cn('flex size-9 items-center justify-center rounded-lg', stat.alert ? 'bg-danger-container text-danger' : 'bg-primary-container text-primary')}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>

      {stat.trend && (
        <p className={cn('mt-1 text-xs font-medium', stat.trendUp ? 'text-success-dark' : 'text-danger')}>{stat.trend}</p>
      )}
      {stat.helper && <p className={cn('mt-1 text-xs', stat.alert ? 'font-medium text-danger' : 'text-ink-muted')}>{stat.helper}</p>}
      {typeof stat.progress === 'number' && <ProgressBar value={stat.progress} className="mt-3" />}
    </Card>
  );
}

