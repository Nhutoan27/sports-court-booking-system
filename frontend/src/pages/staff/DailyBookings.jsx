import { useEffect, useMemo, useState } from 'react';
import { Calendar, ClipboardList } from 'lucide-react';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import DailyBookingsTable from './components/DailyBookingsTable';
import { bookingApi } from '../../services/api/bookingApi';
import { checkInApi } from '../../services/api/checkInApi';
import { courtApi } from '../../services/api/courtApi';

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTimeRange(timeSlots) {
  if (!timeSlots?.length) return '';
  const start = timeSlots[0].startTime?.slice(0, 5);
  const end = timeSlots[timeSlots.length - 1].endTime?.slice(0, 5);
  return `${start} - ${end}`;
}

function toRowShape(booking) {
  return {
    id: booking.id,
    time: formatTimeRange(booking.timeSlots),
    dayLabel: booking.playDate,
    player: booking.userName,
    phone: booking.userPhone,
    court: booking.courtName,
    courtId: booking.courtId,
    status: booking.status,
  };
}

export default function DailyBookings() {
  const [playDate, setPlayDate] = useState(() => toDateInputValue(new Date()));
  const [status, setStatus] = useState('all');
  const [sportId, setSportId] = useState('all');
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ content: [], totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    courtApi.listSports().then(setSports).catch(() => {});
    courtApi.listCourts().then(setCourts).catch(() => {});
  }, []);

  const load = () => {
    setLoading(true);
    setError('');
    bookingApi
      .listAll({ playDate, status: status === 'all' ? undefined : status, page, size: 50 })
      .then(setPageData)
      .catch(() => setError('Không tải được danh sách booking.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [playDate, status, page]);

  const courtSportMap = useMemo(() => new Map(courts.map((c) => [c.id, c.sportId])), [courts]);
  const rows = pageData.content
    .map(toRowShape)
    .filter((r) => sportId === 'all' || courtSportMap.get(r.courtId) === Number(sportId));

  const handleCheckIn = async (row) => {
    setActionError('');
    try {
      await checkInApi.checkIn(row.id);
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Check-in thất bại.');
    }
  };

  const handleNoShow = async (row) => {
    setActionError('');
    try {
      await bookingApi.markNoShow(row.id);
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Đánh dấu no-show thất bại.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
              <ClipboardList className="size-5" />
            </span>
            Đặt sân trong ngày
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <Calendar className="size-4" />
            <input
              type="date"
              value={playDate}
              onChange={(e) => {
                setPage(0);
                setPlayDate(e.target.value);
              }}
              className="rounded-md border border-outline px-2 py-1 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
            containerClassName="w-44"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CHECKED_IN">Đã check-in</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="NO_SHOW">No-show</option>
            <option value="CANCELLED">Đã huỷ</option>
          </Select>
          <Select value={sportId} onChange={(e) => setSportId(e.target.value)} containerClassName="w-40">
            <option value="all">Tất cả môn</option>
            {sports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {actionError && <p className="mb-4 text-sm text-danger">{actionError}</p>}
      {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
      {!loading && rows.length === 0 && <p className="text-sm text-ink-muted">Không có booking nào trong ngày đã chọn.</p>}

      {!loading && rows.length > 0 && <DailyBookingsTable bookings={rows} onCheckIn={handleCheckIn} onNoShow={handleNoShow} />}

      <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
        <span>Tổng {pageData.totalElements} booking</span>
        <Pagination page={page + 1} totalPages={pageData.totalPages || 1} onPageChange={(p) => setPage(p - 1)} />
      </div>
    </div>
  );
}

