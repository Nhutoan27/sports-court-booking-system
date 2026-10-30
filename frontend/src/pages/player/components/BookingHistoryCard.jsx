import { ArrowRight, Clock, FileText, MapPin } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { cn } from '../../../utils/cn';

const STATUS_MAP = {
  'awaiting-deposit': { label: 'Chờ thanh toán cọc', color: 'warning' },
  confirmed: { label: 'Đã xác nhận', color: 'primary' },
  'checked-in': { label: 'Đã check-in', color: 'primary' },
  completed: { label: 'Đã hoàn thành', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'danger' },
  'no-show': { label: 'No-show', color: 'neutral' },
};

const MONTH_LABEL = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

function splitDate(iso) {
  const parts = iso?.split('-');
  if (parts?.length !== 3) return null;
  const monthIdx = Number(parts[1]) - 1;
  if (Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return null;
  return { day: parts[2], month: MONTH_LABEL[monthIdx] };
}

export default function BookingHistoryCard({ booking, onAction }) {
  const status = STATUS_MAP[booking.status];
  const isCancelled = booking.status === 'cancelled';
  const dateParts = splitDate(booking.date);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-white p-4 shadow-card transition-shadow hover:shadow-soft sm:flex-row sm:items-center">
      {dateParts && (
        <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-surface-variant-2 px-3.5 py-2 text-center sm:w-16">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{dateParts.month}</span>
          <span className="font-display text-xl font-bold text-ink">{dateParts.day}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn('font-display text-base font-bold text-ink', isCancelled && 'text-ink-soft line-through')}>
            {booking.court}
          </h3>
          <Badge color={status.color} variant="soft" dot>
            {status.label}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" />
            {booking.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            Cơ sở NhuToan Sports
          </span>
        </div>
        {isCancelled && <p className="mt-1.5 text-xs font-medium text-danger">{booking.cancelReason}</p>}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-outline-variant pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
        {!isCancelled && (
          <div className="text-right">
            <p className="text-xs text-ink-muted">{booking.status === 'awaiting-deposit' ? 'Cọc' : 'Đã thanh toán'}</p>
            <p className="font-display text-base font-bold text-ink">{booking.paid}</p>
          </div>
        )}

        {booking.status === 'awaiting-deposit' ? (
          <Button variant="accent" rounded="full" size="sm" onClick={() => onAction?.(booking)}>
            Thanh toán ngay
          </Button>
        ) : booking.status === 'completed' ? (
          <Button variant="outline" rounded="full" size="sm" icon={FileText} iconPosition="right" onClick={() => onAction?.(booking)}>
            Chi tiết
          </Button>
        ) : (
          <Button variant="outline" rounded="full" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => onAction?.(booking)}>
            Chi tiết
          </Button>
        )}
      </div>
    </div>
  );
}

