import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import FacilityListItem from './components/FacilityListItem';
import PricingRulesForm from './components/PricingRulesForm';
import { courtApi } from '../../services/api/courtApi';

export default function CourtsPricing() {
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', sportId: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadCourts = () => {
    courtApi.listCourts().then((res) => {
      setCourts(res);
      setSelectedId((current) => current ?? res[0]?.id ?? null);
      setLoading(false);
    });
  };

  useEffect(() => {
    courtApi.listSports().then((res) => {
      setSports(res);
      setCreateForm((f) => ({ ...f, sportId: res[0]?.id ?? '' }));
    });
    loadCourts();
  }, []);

  const selected = courts.find((c) => c.id === selectedId);

  const handleCreateCourt = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      const court = await courtApi.createCourt({ name: createForm.name, sportId: Number(createForm.sportId) });
      setShowCreate(false);
      setCreateForm({ name: '', sportId: sports[0]?.id ?? '' });
      loadCourts();
      setSelectedId(court.id);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Tạo sân thất bại.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Quản lý sân</h1>
          <p className="mt-1 text-ink-muted">Cấu hình sân, bảng giá, khung giờ và lịch đóng sân.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>
          Thêm sân mới
        </Button>
      </div>

      {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}

      {!loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-ink">Danh sách sân</h2>
              <span className="rounded-full bg-surface-variant-2 px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                {courts.length} sân
              </span>
            </div>
            <div className="space-y-3">
              {courts.map((court) => (
                <FacilityListItem key={court.id} facility={court} selected={court.id === selectedId} onSelect={(c) => setSelectedId(c.id)} />
              ))}
            </div>
          </div>

          {selected && (
            <PricingRulesForm
              court={selected}
              onStatusChange={(status) => setCourts((prev) => prev.map((c) => (c.id === selected.id ? { ...c, status } : c)))}
            />
          )}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Thêm sân mới</h2>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                aria-label="Đóng"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourt} className="space-y-4">
              <Input
                label="Tên sân"
                required
                placeholder="VD: Sân 4"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
              <Select
                label="Môn thể thao"
                value={createForm.sportId}
                onChange={(e) => setCreateForm({ ...createForm, sportId: e.target.value })}
              >
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>

              {createError && <p className="text-sm text-danger">{createError}</p>}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Huỷ
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Đang tạo...' : 'Tạo sân'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

