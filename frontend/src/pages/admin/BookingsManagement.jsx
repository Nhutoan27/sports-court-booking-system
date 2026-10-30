import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import BookingsTable from './components/BookingsTable';
import BookingDetailPanel from './components/BookingDetailPanel';
import { bookingApi } from '../../services/api/bookingApi';
import { courtApi } from '../../services/api/courtApi';

export default function BookingsManagement() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sportId, setSportId] = useState('all');
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ content: [], totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courtApi.listSports().then(setSports).catch(() => {});
    courtApi.listCourts().then(setCourts).catch(() => {});
  }, []);

  const load = () => {
    setLoading(true);
    bookingApi
      .listAll({ status: status === 'all' ? undefined : status, page, size: 20 })
      .then(setPageData)
      .catch(() => setError('Không tải được danh sách booking.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, page]);

  const courtSportMap = useMemo(() => new Map(courts.map((c) => [c.id, c.sportId])), [courts]);

  const filtered = pageData.content.filter((b) => {
    if (sportId !== 'all' && courtSportMap.get(b.courtId) !== Number(sportId)) return false;
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return (
      b.userName?.toLowerCase().includes(term) ||
      b.userEmail?.toLowerCase().includes(term) ||
      String(b.id).includes(term)
    );
  });

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setSportId('all');
    setPage(0);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
      <div>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Quản lý booking</h1>
            <p className="mt-1 text-ink-muted">Xem toàn bộ đơn đặt sân trong hệ thống.</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            icon={Search}
            placeholder="Tìm theo tên, email, mã booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="flex-1 min-w-[220px]"
          />
          <Select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
            containerClassName="w-44"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ thanh toán cọc</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CHECKED_IN">Đã check-in</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELLED">Đã huỷ</option>
            <option value="NO_SHOW">No-show</option>
          </Select>
          <Select value={sportId} onChange={(e) => setSportId(e.target.value)} containerClassName="w-40">
            <option value="all">Tất cả môn</option>
            {sports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Button variant="outline" icon={X} onClick={clearFilters}>
            Xoá lọc
          </Button>
        </div>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
        {!loading && filtered.length === 0 && <p className="text-sm text-ink-muted">Không có booking nào phù hợp.</p>}
        {!loading && filtered.length > 0 && (
          <BookingsTable bookings={filtered} selectedId={selected?.id} onSelect={setSelected} />
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
          <span>Tổng {pageData.totalElements} booking</span>
          <Pagination page={page + 1} totalPages={pageData.totalPages || 1} onPageChange={(p) => setPage(p - 1)} />
        </div>
      </div>

      {selected && <BookingDetailPanel booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

