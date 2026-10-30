import { Volleyball } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { cn } from '../../../utils/cn';

const STATUS_MAP = {
  PENDING: { label: 'Chờ thanh toán cọc', color: 'neutral' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'primary' },
  CHECKED_IN: { label: 'Đã check-in', color: 'primary' },
  COMPLETED: { label: 'Đã hoàn thành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'neutral' },
  NO_SHOW: { label: 'No-show', color: 'danger' },
};

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  return `${timeSlots[0].startTime?.slice(0, 5)} - ${timeSlots[timeSlots.length - 1].endTime?.slice(0, 5)}`;
}

export default function BookingsTable({ bookings, selectedId, onSelect }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-variant-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <th className="px-5 py-3">Mã</th>
            <th className="px-5 py-3">Khách hàng</th>
            <th className="px-5 py-3">Ngày &amp; Giờ</th>
            <th className="px-5 py-3">Sân</th>
            <th className="px-5 py-3">Trạng thái</th>
            <th className="px-5 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = STATUS_MAP[booking.status] ?? { label: booking.status, color: 'neutral' };
            const isSelected = booking.id === selectedId;
            return (
              <tr
                key={booking.id}
                className={cn(
                  'border-b border-outline-variant transition-colors last:border-0',
                  isSelected ? 'bg-primary-container/40' : 'hover:bg-surface-variant-2/60'
                )}
              >
                <td className="px-5 py-4 font-semibold text-ink">#{booking.id}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{booking.userName}</p>
                  <p className="text-xs text-ink-muted">{booking.userEmail}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-ink">{booking.playDate}</p>
                  <p className="text-xs text-ink-muted">{formatTimeRange(booking.timeSlots)}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 text-ink">
                    <Volleyball className="size-4 text-warning" />
                    {booking.courtName}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge color={status.color} variant="soft">
                    {status.label}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button size="sm" variant="outline" onClick={() => onSelect?.(booking)}>
                    Xem chi tiết
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

