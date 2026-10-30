import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarClock, CheckCircle2, Clock, Home, Wallet } from 'lucide-react';
import BookingHistoryCard from './components/BookingHistoryCard';
import BookingDetailModal from './components/BookingDetailModal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import SegmentedControl from '../../components/common/SegmentedControl';
import { cn } from '../../utils/cn';
import { bookingApi } from '../../services/api/bookingApi';

const REFUND_LABEL = {
  DA_HOAN_COC: 'Đã hoàn cọc',
  KHONG_HOAN_COC: 'Không hoàn cọc (huỷ trễ/no-show)',
};

const GROUPS = [
  { value: 'upcoming', label: 'Sắp tới', statuses: ['awaiting-deposit', 'confirmed', 'checked-in'] },
  { value: 'completed', label: 'Đã hoàn thành', statuses: ['completed'] },
  { value: 'closed', label: 'Đã huỷ / No-show', statuses: ['cancelled', 'no-show'] },
];

const STATUS_TO_CARD = {
  PENDING: 'awaiting-deposit',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  const start = timeSlots[0].startTime?.slice(0, 5);
  const end = timeSlots[timeSlots.length - 1].endTime?.slice(0, 5);
  return `${start} - ${end}`;
}

function toCardShape(booking) {
  return {
    id: booking.id,
    court: booking.courtName,
    date: booking.playDate,
    time: formatTimeRange(booking.timeSlots),
    status: STATUS_TO_CARD[booking.status] ?? booking.status,
    total: formatCurrency(booking.totalPrice),

    paid: formatCurrency(booking.status === 'PENDING' || booking.paymentStatus === 'SUCCESS' ? booking.depositAmount : 0),
    cancelReason: booking.status === 'CANCELLED' ? (REFUND_LABEL[booking.refundStatus] ?? 'Đã huỷ') : undefined,
    paymentUrl: booking.paymentUrl,
  };
}

const PAYMENT_STATUS_BANNER = {
  success: { text: 'Thanh toán cọc thành công, booking đã được xác nhận.', tone: 'text-success-dark bg-success/10' },
  failed: { text: 'Thanh toán không thành công. Bạn có thể thử lại từ mục "Chờ thanh toán cọc" bên dưới.', tone: 'text-danger bg-danger-container/40' },
  error: { text: 'Có lỗi khi xử lý thanh toán, vui lòng kiểm tra lại lịch sử đặt sân.', tone: 'text-danger bg-danger-container/40' },
};

export default function BookingHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentStatus = searchParams.get('paymentStatus');
  const [group, setGroup] = useState('upcoming');
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ content: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailBookingId, setDetailBookingId] = useState(null);
  const bookingIdParam = searchParams.get('bookingId');
  const [successInfo, setSuccessInfo] = useState(null);

  useEffect(() => {
    if (paymentStatus !== 'success' || !bookingIdParam) return;
    bookingApi
      .getById(bookingIdParam)
      .then(setSuccessInfo)
      .catch(() => {});
  }, [paymentStatus, bookingIdParam]);

  const dismissSuccess = () => {
    setSuccessInfo(null);
    searchParams.delete('paymentStatus');
    searchParams.delete('bookingId');
    setSearchParams(searchParams, { replace: true });
  };

  const reload = () => {
    setLoading(true);
    setError('');
    bookingApi
      .listMine({ page })
      .then(setPageData)
      .catch(() => setError('Không tải được lịch sử đặt sân, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  };

  useEffect(reload, [page]);

  const bookings = useMemo(() => pageData.content.map(toCardShape), [pageData]);
  const groupCounts = useMemo(() => {
    const counts = {};
    for (const g of GROUPS) {
      counts[g.value] = bookings.filter((b) => g.statuses.includes(b.status)).length;
    }
    return counts;
  }, [bookings]);
  const filtered = useMemo(() => {
    const activeStatuses = GROUPS.find((g) => g.value === group)?.statuses ?? [];
    return bookings.filter((b) => activeStatuses.includes(b.status));
  }, [bookings, group]);

  const handleAction = (booking) => {
    if (booking.status === 'awaiting-deposit') {
      navigate(`/player/checkout/${booking.id}`);
      return;
    }
    setDetailBookingId(booking.id);
  };

  if (successInfo) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="size-10 text-success-dark" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Đặt sân thành công!</h1>
          <p className="mt-1 text-sm text-ink-muted">Mã đặt sân</p>
          <p className="font-display text-xl font-extrabold tracking-wide text-primary">
            #BK{String(successInfo.id).padStart(5, '0')}
          </p>

          <div className="mt-5 space-y-2.5 rounded-xl bg-surface-variant-2 p-4 text-left text-sm">
            <p className="font-semibold text-ink">
              {successInfo.courtName}
            </p>
            <p className="flex items-center gap-1.5 text-ink-muted">
              <CalendarClock className="size-3.5 shrink-0 text-primary" /> {successInfo.playDate}
            </p>
            <p className="flex items-center gap-1.5 text-ink-muted">
              <Clock className="size-3.5 shrink-0 text-primary" /> {formatTimeRange(successInfo.timeSlots)}
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-ink">
              <Wallet className="size-3.5 shrink-0 text-primary" /> Đã cọc {formatCurrency(successInfo.depositAmount)}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" icon={Home} onClick={() => navigate('/player')}>
              Về trang chủ
            </Button>
            <Button className="flex-1" icon={CalendarClock} onClick={dismissSuccess}>
              Xem đặt sân
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
          <CalendarClock className="size-5" />
        </span>
        Lịch sử đặt sân
      </h1>
      <p className="mt-2 text-ink-muted">Quản lý và xem lại các lượt đặt sân của bạn.</p>

      {paymentStatus && PAYMENT_STATUS_BANNER[paymentStatus] && (
        <div className={cn('mt-4 rounded-lg px-4 py-3 text-sm font-medium', PAYMENT_STATUS_BANNER[paymentStatus].tone)}>
          {PAYMENT_STATUS_BANNER[paymentStatus].text}
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => {
              searchParams.delete('paymentStatus');
              searchParams.delete('bookingId');
              setSearchParams(searchParams, { replace: true });
            }}
          >
            Đóng
          </button>
        </div>
      )}

      <SegmentedControl
        options={GROUPS.map((g) => ({ value: g.value, label: `${g.label} (${groupCounts[g.value] ?? 0})` }))}
        value={group}
        onChange={setGroup}
        className="mt-6 w-full sm:w-fit"
      />

      <div key={group} className="mt-5 animate-fade-in space-y-3">
        {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-ink-muted">Chưa có booking nào ở nhóm này.</p>
        )}

        {filtered.map((booking) => (
          <BookingHistoryCard key={booking.id} booking={booking} onAction={handleAction} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination page={page + 1} totalPages={pageData.totalPages || 1} onPageChange={(p) => setPage(p - 1)} />
      </div>

      {detailBookingId && (
        <BookingDetailModal
          bookingId={detailBookingId}
          onClose={() => setDetailBookingId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

