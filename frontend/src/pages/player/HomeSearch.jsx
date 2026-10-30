import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, SlidersHorizontal, Trophy, X } from 'lucide-react';
import Button from '../../components/common/Button';
import SearchFilterBar from './components/SearchFilterBar';
import CourtCard from './components/CourtCard';
import { courtApi } from '../../services/api/courtApi';
import { bookingApi } from '../../services/api/bookingApi';

const PERIOD_HOURS = {
  morning: (h) => h < 12,
  afternoon: (h) => h >= 12 && h < 17,
  evening: (h) => h >= 17,
};

async function hasAvailableSlot(court, filters) {
  if (!filters.date) return true;

  const [slots, bookedIds] = await Promise.all([
    courtApi.listTimeSlots(court.id),
    bookingApi.availability(court.id, filters.date).catch(() => []),
  ]);
  const bookedSet = new Set(bookedIds);
  const periodCheck = PERIOD_HOURS[filters.timeSlot];

  return slots.some((slot) => {
    if (bookedSet.has(slot.id)) return false;
    if (!periodCheck) return true;
    return periodCheck(Number(slot.startTime.slice(0, 2)));
  });
}

export default function HomeSearch() {
  const navigate = useNavigate();

  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [filters, setFilters] = useState({ sportId: 'all', date: '', timeSlot: 'any' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    courtApi.listSports().then((res) => setSports(res.filter((s) => s.status === 'ACTIVE'))).catch(() => {});
  }, []);

  useEffect(() => {

    setLoading(true);
    setError('');

    const sportId = filters.sportId === 'all' ? null : filters.sportId;
    courtApi
      .listCourts(sportId)
      .then(async (all) => {

        const list = all.filter((c) => c.status === 'ACTIVE');
        const flags = await Promise.all(list.map((c) => hasAvailableSlot(c, filters)));
        setCourts(list.filter((_, i) => flags[i]));
      })
      .catch(() => setError('Không tải được danh sách sân, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>

      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-hover px-6 py-10 sm:py-12">

        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-primary-container-alt/15 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl items-center gap-3">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm sm:flex">
            <Trophy className="size-6 text-white" />
          </span>
          <div>
            <h1 className="text-display-athletic text-3xl text-white sm:text-4xl">Tìm &amp; đặt sân</h1>
            <p className="mt-1.5 text-sm text-white/85 sm:text-base">
              Cầu lông &amp; Pickleball — xem tình trạng sân theo thời gian thực, giữ chỗ trong tích tắc.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Sân khả dụng</h2>
          <div className="flex items-center gap-3">
            {!loading && <span className="text-sm text-ink-muted">{courts.length} sân</span>}
            <button
              type="button"
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-1.5 rounded-full border border-outline px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary/40 lg:hidden"
            >
              <SlidersHorizontal className="size-4" />
              Lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <SearchFilterBar sports={sports} value={filters} onChange={setFilters} />
          </div>

          <div>
            {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-card">
                    <div className="h-44 animate-pulse bg-surface-variant-2" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-surface-variant-2" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-surface-variant-2" />
                      <div className="mt-3 h-9 w-full animate-pulse rounded-full bg-surface-variant-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            {!loading && !error && courts.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-variant-2/40 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary-container text-primary">
                  <SearchX className="size-6" />
                </span>
                <p className="font-medium text-ink">Chưa tìm thấy sân phù hợp.</p>
                <p className="max-w-xs text-sm text-ink-muted">Thử đổi ngày, buổi chơi hoặc môn thể thao khác xem sao.</p>
                <Button variant="outline" onClick={() => setFilters({ sportId: 'all', date: '', timeSlot: 'any' })}>
                  Xoá bộ lọc
                </Button>
              </div>
            )}

            {!loading && !error && courts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {courts.map((court) => (
                  <CourtCard key={court.id} court={court} onSelect={(c) => navigate(`/player/courts/${c.id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilter(false)}>
          <div
            className="max-h-[85vh] w-full animate-fade-in-up overflow-y-auto rounded-t-2xl bg-background p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">Bộ lọc</span>
              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                aria-label="Đóng"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <SearchFilterBar sports={sports} value={filters} onChange={setFilters} />
            <Button className="mt-4 w-full" onClick={() => setShowMobileFilter(false)}>
              Xem {courts.length} sân
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

