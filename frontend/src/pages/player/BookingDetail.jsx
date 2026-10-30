import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Stepper from '../../components/common/Stepper';
import TimeSlotGrid from './components/TimeSlotGrid';
import BookingSummaryPanel from './components/BookingSummaryPanel';
import { courtApi } from '../../services/api/courtApi';
import { bookingApi } from '../../services/api/bookingApi';
import { sportImage } from '../../utils/sportImages';

const BOOKING_STEPS = ['Chọn sân', 'Chọn ngày & giờ', 'Xác nhận', 'Thanh toán', 'Hoàn tất'];

const ESTIMATED_DEPOSIT_PERCENT = 30;

function toDateInputValue(date) {

  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function periodOf(startTime) {
  const hour = Number(startTime.slice(0, 2));
  if (hour < 12) return 'Buổi sáng';
  if (hour < 17) return 'Buổi chiều';
  return 'Buổi tối';
}

function priceForSlot(slot, prices) {
  const match = prices.find((p) => slot.startTime >= p.rangeStart && slot.startTime < p.rangeEnd);
  return match?.price ?? 0;
}

const MAX_CONSECUTIVE_SLOTS = 3;

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [prices, setPrices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedIds, setBookedIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [playDate, setPlayDate] = useState(() => toDateInputValue(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([courtApi.getCourt(id), courtApi.listPrices(id), courtApi.listTimeSlots(id)])
      .then(([courtRes, pricesRes, slotsRes]) => {
        setCourt(courtRes);
        setPrices(pricesRes);
        setTimeSlots(slotsRes);
      })
      .catch(() => setError('Không tải được thông tin sân, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setSelectedIds(new Set());
    bookingApi
      .availability(id, playDate)
      .then((ids) => setBookedIds(new Set(ids)))
      .catch(() => setBookedIds(new Set()));
  }, [id, playDate]);

  const periods = useMemo(() => {
    const grouped = {};
    for (const slot of timeSlots) {
      const period = periodOf(slot.startTime);
      grouped[period] ??= [];
      grouped[period].push({
        id: slot.id,
        time: slot.startTime.slice(0, 5),
        status: bookedIds.has(slot.id) ? 'booked' : selectedIds.has(slot.id) ? 'selected' : 'available',
        price: priceForSlot(slot, prices),
      });
    }
    return grouped;
  }, [timeSlots, bookedIds, selectedIds, prices]);

  const selectedSlotDetails = useMemo(
    () =>
      timeSlots
        .filter((s) => selectedIds.has(s.id))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [timeSlots, selectedIds]
  );

  const selectedSlotLabels = selectedSlotDetails.map((s) => `${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)}`);
  let totalPrice = 0;
  for (const s of selectedSlotDetails) {
    totalPrice += priceForSlot(s, prices);
  }
  const depositAmount = Math.round((totalPrice * ESTIMATED_DEPOSIT_PERCENT) / 100);

  const toggleSlot = (timeSlotId) => {
    if (bookedIds.has(timeSlotId)) return;

    const sorted = [...timeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const indexOf = new Map(sorted.map((s, i) => [s.id, i]));
    const clickedIdx = indexOf.get(timeSlotId);
    const selectedIdx = [...selectedIds].map((sid) => indexOf.get(sid)).sort((a, b) => a - b);

    if (selectedIds.has(timeSlotId)) {

      if (clickedIdx !== selectedIdx[0] && clickedIdx !== selectedIdx[selectedIdx.length - 1]) return;
      const next = new Set(selectedIds);
      next.delete(timeSlotId);
      setSelectedIds(next);
      return;
    }

    if (selectedIdx.length > 0) {
      const isAdjacent = clickedIdx === selectedIdx[0] - 1 || clickedIdx === selectedIdx[selectedIdx.length - 1] + 1;
      if (!isAdjacent) {
        setSubmitError(`Chỉ được chọn tối đa ${MAX_CONSECUTIVE_SLOTS} khung giờ LIÊN TIẾP trong 1 lượt đặt sân.`);
        return;
      }
      if (selectedIdx.length >= MAX_CONSECUTIVE_SLOTS) {
        setSubmitError(`Chỉ được chọn tối đa ${MAX_CONSECUTIVE_SLOTS} khung giờ liên tiếp trong 1 lượt đặt sân.`);
        return;
      }
    }

    setSubmitError('');
    setSelectedIds(new Set(selectedIds).add(timeSlotId));
  };

  const changeDate = (deltaDays) => {
    const next = new Date(playDate);
    next.setDate(next.getDate() + deltaDays);
    const todayStr = toDateInputValue(new Date());
    const nextStr = toDateInputValue(next);
    if (nextStr < todayStr) return;
    setPlayDate(nextStr);
  };

  const handleCheckout = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const booking = await bookingApi.create({
        courtId: Number(id),
        playDate,
        timeSlotIds: [...selectedIds],
      });
      navigate(`/player/checkout/${booking.id}`, { state: { booking } });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Đặt sân thất bại, vui lòng thử lại.');

      bookingApi.availability(id, playDate).then((ids) => setBookedIds(new Set(ids))).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-ink-muted">Đang tải...</div>;
  }
  if (error || !court) {
    return <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-danger">{error || 'Không tìm thấy sân.'}</div>;
  }

  const activeStepIndex = selectedIds.size > 0 ? 2 : 1;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <button
          type="button"
          onClick={() => navigate('/player')}
          className="mb-5 flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách sân <span className="text-outline">/</span> <span className="font-medium text-ink">{court.name}</span>
        </button>

        <Stepper steps={BOOKING_STEPS} activeIndex={activeStepIndex} className="mb-6 max-w-2xl" />
      </div>

      <div className="relative h-56 sm:h-72">
        <img src={sportImage(court.sportName)} alt={court.sportName} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink">
                {court.sportName}
              </span>
              <h1 className="font-display text-3xl font-bold text-white drop-shadow-sm">{court.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                <MapPin className="size-4" />
                Cơ sở NhuToan Sports
              </p>
            </div>
            {court.status !== 'ACTIVE' && (
              <Badge color="danger" variant="solid">
                Tạm ngưng phục vụ
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Chọn khung giờ</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Mỗi khung 1 giờ, chọn tối đa {MAX_CONSECUTIVE_SLOTS} khung <strong>liên tiếp</strong> trong 1 lượt đặt.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-outline px-3 py-1.5 text-sm">
                  <button type="button" onClick={() => changeDate(-1)} aria-label="Ngày trước">
                    <ChevronLeft className="size-4 cursor-pointer text-ink-muted" />
                  </button>
                  <span className="font-medium text-ink">{playDate}</span>
                  <button type="button" onClick={() => changeDate(1)} aria-label="Ngày sau">
                    <ChevronRight className="size-4 cursor-pointer text-ink-muted" />
                  </button>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-5 rounded-lg bg-surface-variant-2 px-4 py-2.5 text-xs font-medium text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded border-2 border-success bg-white" /> Còn trống
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-white ring-1 ring-inset ring-outline-variant" /> Đã đặt
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded bg-primary" /> Đang chọn
                </span>
              </div>

              {submitError && <p className="mb-4 text-sm text-danger">{submitError}</p>}

              <TimeSlotGrid periods={periods} onToggle={toggleSlot} />
            </Card>
          </div>

          <div>
            <BookingSummaryPanel
              courtName={court.name}
              playDate={playDate}
              selectedSlots={selectedSlotLabels}
              totalPrice={totalPrice}
              depositAmount={depositAmount}
              depositPercent={ESTIMATED_DEPOSIT_PERCENT}
              submitting={submitting}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

