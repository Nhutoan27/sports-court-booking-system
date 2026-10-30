import { useEffect, useMemo, useState } from 'react';
import { Search, Radio } from 'lucide-react';
import Input from '../../components/common/Input';
import CourtStatusGrid from './components/CourtStatusGrid';
import { courtApi } from '../../services/api/courtApi';
import { bookingApi } from '../../services/api/bookingApi';

const statusLegend = [
  { status: 'available', label: 'Còn trống' },
  { status: 'booked', label: 'Đã xác nhận' },
  { status: 'playing', label: 'Đang chơi' },
  { status: 'completed', label: 'Đã hoàn thành' },
  { status: 'no-show', label: 'No-show' },
];

const LEGEND_SWATCH = {
  available: 'border border-primary bg-white',
  booked: 'bg-warning',
  playing: 'bg-primary',
  completed: 'bg-primary-container',
  'no-show': 'border-2 border-dashed border-danger bg-danger-container',
};

const STATUS_TO_CELL = {
  CONFIRMED: 'booked',
  CHECKED_IN: 'playing',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
};

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

export default function CourtStatus() {
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const today = todayIso();

  useEffect(() => {
    Promise.all([courtApi.listCourts(), bookingApi.listAll({ playDate: today, size: 200 })])
      .then(([courtsRes, bookingsRes]) => {
        setCourts(courtsRes);
        setBookings(bookingsRes.content);
      })
      .finally(() => setLoading(false));

  }, []);

  const { timeColumns, rows, currentTimeColumn } = useMemo(() => {
    const columnSet = new Set();
    for (const b of bookings) {
      for (const slot of b.timeSlots) columnSet.add(slot.startTime.slice(0, 5));
    }
    const columns = [...columnSet].sort();

    const rowsByCourtId = new Map(
      courts.map((c) => [c.id, { court: c.name, type: c.sportName, courtId: c.id, slots: {} }])
    );
    for (const b of bookings) {
      const cellStatus = STATUS_TO_CELL[b.status];
      if (!cellStatus) continue;
      const row = rowsByCourtId.get(b.courtId);
      if (!row) continue;
      for (const slot of b.timeSlots) {
        row.slots[slot.startTime.slice(0, 5)] = { status: cellStatus, label: b.userName };
      }
    }

    const now = new Date();
    const currentHourLabel = `${now.getHours().toString().padStart(2, '0')}:00`;

    return { timeColumns: columns, rows: [...rowsByCourtId.values()], currentTimeColumn: currentHourLabel };
  }, [courts, bookings]);

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    if (row.court.toLowerCase().includes(term)) return true;
    return Object.values(row.slots).some((slot) => slot.label?.toLowerCase().includes(term));
  });

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
              <Radio className="size-5" />
            </span>
            Trạng thái sân trực tiếp
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Hôm nay, {today}</p>
        </div>
        <Input
          icon={Search}
          placeholder="Tìm sân hoặc người chơi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="w-64"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-ink-muted shadow-card">
        <span className="font-semibold text-ink">Chú thích:</span>
        {statusLegend.map((item) => (
          <span key={item.status} className="flex items-center gap-1.5">
            <span className={`size-3.5 rounded ${LEGEND_SWATCH[item.status]}`} />
            {item.label}
          </span>
        ))}
      </div>

      {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
      {!loading && timeColumns.length === 0 && <p className="text-sm text-ink-muted">Chưa có booking nào hôm nay.</p>}
      {!loading && timeColumns.length > 0 && (
        <CourtStatusGrid rows={filteredRows} timeColumns={timeColumns} currentTimeColumn={currentTimeColumn} />
      )}
    </div>
  );
}

