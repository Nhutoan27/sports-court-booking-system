import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Lock, Landmark, Info, CircleCheck, XCircle, Timer, Trophy } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Stepper from '../../components/common/Stepper';
import CountdownTimer from './components/CountdownTimer';
import { bookingApi } from '../../services/api/bookingApi';
import { cn } from '../../utils/cn';

const BOOKING_STEPS = ['Chọn sân', 'Chọn ngày & giờ', 'Xác nhận', 'Thanh toán', 'Hoàn tất'];

const HOLD_MINUTES = 5;

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  const start = timeSlots[0].startTime?.slice(0, 5);
  const end = timeSlots[timeSlots.length - 1].endTime?.slice(0, 5);
  return `${start} - ${end}`;
}

function secondsUntilExpiry(createdAt) {
  const deadline = new Date(createdAt).getTime() + HOLD_MINUTES * 60_000;
  return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
}

export default function DepositPayment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking ?? null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {

    if (location.state?.booking) return;
    setLoading(true);
    bookingApi
      .getById(bookingId)
      .then(setBooking)
      .catch(() => setError('Không tải được thông tin booking, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [bookingId, location.state]);

  useEffect(() => {
    if (booking?.status !== 'PENDING' || expired) return undefined;

    const checkExpiry = () => {
      if (secondsUntilExpiry(booking.createdAt) <= 0) {
        setExpired(true);
        bookingApi.getById(bookingId).then(setBooking).catch(() => {});
      }
    };
    checkExpiry();
    const id = setInterval(checkExpiry, 5000);
    return () => clearInterval(id);
  }, [booking, bookingId, expired]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await bookingApi.cancel(bookingId);
      navigate('/player/bookings');
    } catch {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-ink-muted">
        <span className="size-4 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        Đang tải...
      </div>
    );
  }
  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-danger-container text-danger">
          <AlertTriangle className="size-6" />
        </span>
        <p className="text-sm text-danger">{error || 'Không tìm thấy booking.'}</p>
      </div>
    );
  }
  if (booking.status !== 'PENDING') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-container text-primary">
          <Info className="size-6" />
        </span>
        <p className="text-sm text-ink-muted">Booking này không còn ở trạng thái chờ thanh toán cọc.</p>
        <Button variant="outline" onClick={() => navigate('/player/bookings')}>
          Xem lịch sử đặt sân
        </Button>
      </div>
    );
  }
  if (expired) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-danger-container text-danger">
          <Timer className="size-7" />
        </span>
        <p className="font-display text-lg font-bold text-danger">Đã hết thời gian giữ chỗ</p>
        <p className="max-w-sm text-sm text-ink-muted">
          Chỗ vừa giữ đã được giải phóng cho người khác đặt (giữ chỗ tạm tối đa 5 phút). Vui lòng quay lại chọn giờ và đặt lại.
        </p>
        <Button onClick={() => navigate(`/player/courts/${booking.courtId}`)}>Đặt lại sân này</Button>
      </div>
    );
  }

  const secondsLeft = secondsUntilExpiry(booking.createdAt);
  const urgent = secondsLeft < 60;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-outline-variant bg-white px-6 py-4">
        <button type="button" onClick={() => navigate(-1)} className="rounded-md p-1 text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft className="size-5" />
        </button>
        <span className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Trophy className="size-4" />
          </span>
          <span className="text-display-athletic text-lg text-ink">NhuToan</span>
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-muted">
          Thanh toán an toàn <Lock className="size-4 text-primary" />
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Stepper steps={BOOKING_STEPS} activeIndex={3} />
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Thông tin đặt sân</h2>

          <div className="mb-3 rounded-lg bg-surface-variant-2 p-4">
            <p className="mb-1 text-xs font-semibold uppercase text-ink-muted">Sân</p>
            <p className="font-semibold text-ink">{booking.courtName}</p>
          </div>

          <div className="rounded-lg bg-surface-variant-2 p-4">
            <p className="mb-1 text-xs font-semibold uppercase text-ink-muted">Thời gian</p>
            <p className="font-semibold text-ink">
              {booking.playDate} • {formatTimeRange(booking.timeSlots)}
            </p>
          </div>

          <div className="mt-4 space-y-2 border-t border-outline-variant pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Tổng tiền</span>
              <span className="font-medium text-ink">{formatCurrency(booking.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Tiền cọc</span>
              <span className="font-display font-bold text-primary">{formatCurrency(booking.depositAmount)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-center font-display text-lg font-bold text-ink">Thanh toán tiền cọc</h2>
          <p className="mb-4 text-center text-sm text-ink-muted">
            Hoàn tất thanh toán để xác nhận booking. Số tiền còn lại thanh toán trực tiếp tại sân.
          </p>

          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Phương thức thanh toán</p>
          <div className="mb-5 flex items-center justify-between rounded-lg border-2 border-primary bg-primary-container/30 px-4 py-3">
            <span className="flex items-center gap-2 font-medium text-ink">
              <Landmark className="size-5 text-primary" />
              MoMo
            </span>
            <CircleCheck className="size-5 text-primary" />
          </div>

          <div
            className={cn(
              'mb-5 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium',
              urgent ? 'bg-danger-container text-danger animate-pulse' : 'bg-surface-variant-2 text-ink'
            )}
          >
            <Timer className="size-4" />
            Thời gian giữ chỗ còn lại: <CountdownTimer initialSeconds={secondsLeft} className="font-display font-bold" />
          </div>

          <div className="mb-5 flex gap-3 rounded-lg bg-surface-variant-2 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="mb-1 font-semibold text-ink">Hướng dẫn</p>
              <p className="text-ink-muted">Bấm &quot;Thanh toán ngay&quot; để chuyển sang cổng thanh toán.</p>
              <p className="text-ink-muted">Hoàn tất giao dịch, hệ thống sẽ tự xác nhận booking cho bạn.</p>
            </div>
          </div>

          {!booking.paymentUrl && (
            <p className="mb-3 text-center text-xs text-danger">
              Không lấy được liên kết thanh toán, vui lòng tải lại trang. Nếu vẫn không được, báo Admin kiểm tra
              cấu hình cổng thanh toán ở backend.
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" icon={XCircle} disabled={cancelling} onClick={handleCancel}>
              {cancelling ? 'Đang huỷ...' : 'Huỷ giao dịch'}
            </Button>
            <Button
              variant="accent"
              icon={CircleCheck}
              className="flex-1"
              disabled={!booking.paymentUrl}
              onClick={() => {

                if (booking.paymentUrl.includes('/bookings/momo-return')) {
                  navigate(`/player/checkout/${bookingId}/gateway`, { state: { booking, paymentUrl: booking.paymentUrl } });
                } else {
                  window.location.href = booking.paymentUrl;
                }
              }}
            >
              Thanh toán ngay
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

