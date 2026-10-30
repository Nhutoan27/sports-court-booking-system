import { X } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  return `${timeSlots[0].startTime?.slice(0, 5)} - ${timeSlots[timeSlots.length - 1].endTime?.slice(0, 5)}`;
}

export default function BookingDetailPanel({ booking, onClose }) {
  return (
    <Card className="sticky top-6 animate-fade-in-up">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Booking #{booking.id}</h2>
          <p className="text-sm text-ink-muted">Chi tiết đặt sân</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg bg-surface-variant-2 p-4 text-sm">
        <div>
          <p className="text-xs text-ink-muted">Khách hàng</p>
          <p className="font-semibold text-ink">{booking.userName}</p>
          <p className="text-xs text-ink-muted">{booking.userEmail}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Sân</p>
          <p className="font-semibold text-ink">{booking.courtName}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Thời gian</p>
          <p className="font-semibold text-ink">
            {booking.playDate} • {formatTimeRange(booking.timeSlots)}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Trạng thái thanh toán</p>
          <p className="font-semibold text-ink">{booking.paymentStatus ?? 'Chưa có giao dịch'}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Tổng tiền</p>
          <p className="font-semibold text-ink">{formatCurrency(booking.totalPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Tiền cọc</p>
          <p className="font-semibold text-ink">{formatCurrency(booking.depositAmount)}</p>
        </div>
      </div>

      <Badge color="primary" variant="soft">
        {booking.status}
      </Badge>
    </Card>
  );
}

