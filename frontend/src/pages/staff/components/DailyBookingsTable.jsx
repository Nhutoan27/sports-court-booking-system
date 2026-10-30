import { Volleyball, UserCheck, Ban } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

const STATUS_MAP = {
  PENDING: { label: 'Chờ thanh toán cọc', color: 'neutral' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'warning' },
  CHECKED_IN: { label: 'Đã check-in', color: 'primary' },
  COMPLETED: { label: 'Đã hoàn thành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'neutral' },
  NO_SHOW: { label: 'No-show', color: 'danger' },
};

export default function DailyBookingsTable({ bookings, onCheckIn, onNoShow }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-variant-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <th className="px-5 py-3">Khung giờ</th>
            <th className="px-5 py-3">Người chơi</th>
            <th className="px-5 py-3">Sân</th>
            <th className="px-5 py-3">Trạng thái</th>
            <th className="px-5 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = STATUS_MAP[booking.status];
            return (
              <tr key={booking.id} className="border-b border-outline-variant transition-colors last:border-0 hover:bg-surface-variant-2/60">
                <td className="px-5 py-4">
                  <p className="font-semibold text-ink">{booking.time}</p>
                  <p className="text-xs text-ink-muted">{booking.dayLabel}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{booking.player}</p>
                  <p className="text-xs text-ink-muted">{booking.phone}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <Volleyball className="size-4 text-warning" />
                    {booking.court}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge color={status.color} variant="soft">
                    {status.label}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {booking.status === 'CONFIRMED' && (
                      <>
                        <Button size="sm" icon={UserCheck} onClick={() => onCheckIn?.(booking)}>
                          Check-in
                        </Button>
                        <Button size="sm" variant="outline" icon={Ban} onClick={() => onNoShow?.(booking)}>
                          No-show
                        </Button>
                      </>
                    )}
                    {booking.status !== 'CONFIRMED' && <span className="text-ink-soft">—</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

