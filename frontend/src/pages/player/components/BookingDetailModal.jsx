import { useEffect, useState } from 'react';
import { X, Info } from 'lucide-react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { bookingApi } from '../../../services/api/bookingApi';

const STATUS_LABEL = {
  PENDING: { label: 'Chờ thanh toán cọc', color: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'primary' },
  CHECKED_IN: { label: 'Đã check-in', color: 'primary' },
  COMPLETED: { label: 'Đã hoàn thành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'danger' },
  NO_SHOW: { label: 'No-show', color: 'neutral' },
};

const REFUND_LABEL = {
  DA_HOAN_COC: 'Đã hoàn 100% tiền cọc',
  KHONG_HOAN_COC: 'Không được hoàn tiền cọc (huỷ trễ hoặc no-show)',
};

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  return `${timeSlots[0].startTime?.slice(0, 5)} - ${timeSlots[timeSlots.length - 1].endTime?.slice(0, 5)}`;
}

export default function BookingDetailModal({ bookingId, onClose, onChanged }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLoading(true);
    bookingApi
      .getById(bookingId)
      .then(setBooking)
      .catch(() => setError('Không tải được chi tiết booking.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn huỷ booking này?')) return;
    setCancelling(true);
    setError('');
    try {
      const updated = await bookingApi.cancel(bookingId);
      setBooking(updated);
      onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Huỷ booking thất bại, vui lòng thử lại.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = booking?.status === 'CONFIRMED';
  const status = booking ? STATUS_LABEL[booking.status] ?? { label: booking.status, color: 'neutral' } : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-fade-in-up">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Chi tiết booking #{bookingId}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink">
            <X className="size-5" />
          </button>
        </div>

        {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
        {!loading && error && !booking && <p className="text-sm text-danger">{error}</p>}

        {!loading && booking && (
          <>
            <Badge color={status.color} variant="soft" dot className="mb-4">
              {status.label}
            </Badge>

            <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-surface-variant-2 p-4 text-sm">
              <div>
                <p className="text-xs text-ink-muted">Sân</p>
                <p className="font-semibold text-ink">{booking.courtName}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Ngày</p>
                <p className="font-semibold text-ink">{booking.playDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-ink-muted">Giờ chơi</p>
                <p className="font-semibold text-ink">{formatTimeRange(booking.timeSlots)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Tổng tiền</p>
                <p className="font-semibold text-ink">{formatCurrency(booking.totalPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Tiền cọc</p>
                <p className="font-semibold text-ink">{formatCurrency(booking.depositAmount)}</p>
              </div>
              {booking.paymentStatus && (
                <div className="col-span-2">
                  <p className="text-xs text-ink-muted">Thanh toán</p>
                  <p className="font-semibold text-ink">{booking.paymentStatus}</p>
                </div>
              )}
              {booking.refundStatus && (
                <div className="col-span-2">
                  <p className="text-xs text-ink-muted">Hoàn cọc</p>
                  <p className="font-semibold text-ink">{REFUND_LABEL[booking.refundStatus] ?? booking.refundStatus}</p>
                </div>
              )}
            </div>

            {error && <p className="mb-3 text-sm text-danger">{error}</p>}

            {canCancel && (
              <>
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-outline-variant bg-white p-3 text-xs text-ink-muted">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  Huỷ trước giờ chơi ít nhất 2 tiếng: hoàn 100% tiền cọc. Huỷ trễ hơn: không hoàn cọc.
                </div>
                <Button variant="danger" className="w-full" disabled={cancelling} onClick={handleCancel}>
                  {cancelling ? 'Đang huỷ...' : 'Huỷ đặt sân'}
                </Button>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

