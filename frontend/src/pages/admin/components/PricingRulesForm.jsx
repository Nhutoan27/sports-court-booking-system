import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { courtApi } from '../../../services/api/courtApi';

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

export default function PricingRulesForm({ court, onStatusChange }) {
  const [prices, setPrices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [closures, setClosures] = useState([]);
  const [error, setError] = useState('');

  const [priceForm, setPriceForm] = useState({ rangeStart: '06:00', rangeEnd: '12:00', price: '' });
  const [slotForm, setSlotForm] = useState({ startTime: '06:00', endTime: '07:00' });
  const [closureForm, setClosureForm] = useState({ startTime: '', endTime: '' });

  const loadAll = () => {
    courtApi.listPrices(court.id).then(setPrices).catch(() => {});
    courtApi.listTimeSlots(court.id).then(setSlots).catch(() => {});
    courtApi.listClosures(court.id).then(setClosures).catch(() => {});
  };

  useEffect(loadAll, [court.id]);

  const handleAddPrice = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await courtApi.createPrice(court.id, {
        rangeStart: `${priceForm.rangeStart}:00`,
        rangeEnd: `${priceForm.rangeEnd}:00`,
        price: Number(priceForm.price),
      });
      setPriceForm({ ...priceForm, price: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm mức giá thất bại.');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await courtApi.createTimeSlot(court.id, {
        startTime: `${slotForm.startTime}:00`,
        endTime: `${slotForm.endTime}:00`,
      });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm khung giờ thất bại.');
    }
  };

  const handleAddClosure = async (e) => {
    e.preventDefault();
    if (!closureForm.startTime || !closureForm.endTime) return;
    setError('');
    try {
      await courtApi.createClosure(court.id, closureForm);
      setClosureForm({ startTime: '', endTime: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo lịch đóng sân thất bại.');
    }
  };

  const handleToggleStatus = async () => {
    const next = court.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await courtApi.updateCourtStatus(court.id, next);
    onStatusChange?.(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">{court.name}</h2>
            <p className="text-sm text-ink-muted">{court.sportName}</p>
          </div>
          <Button variant={court.status === 'ACTIVE' ? 'outline' : 'primary'} size="sm" onClick={handleToggleStatus}>
            {court.status === 'ACTIVE' ? 'Tạm ngưng sân' : 'Kích hoạt lại'}
          </Button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-ink">Bảng giá theo khung giờ</h3>
        <div className="mb-4 overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant-2 text-xs font-semibold uppercase text-ink-muted">
                <th className="px-4 py-2.5">Từ giờ</th>
                <th className="px-4 py-2.5">Đến giờ</th>
                <th className="px-4 py-2.5">Giá / giờ</th>
                <th className="px-4 py-2.5 text-right">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant transition-colors last:border-0 hover:bg-surface-variant-2/60">
                  <td className="px-4 py-3">{p.rangeStart?.slice(0, 5)}</td>
                  <td className="px-4 py-3">{p.rangeEnd?.slice(0, 5)}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label="Xoá mức giá"
                      className="rounded-md p-1 text-ink-soft transition-colors hover:bg-danger-container hover:text-danger"
                      onClick={() => courtApi.deletePrice(p.id).then(loadAll)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center text-ink-muted">
                    Chưa có mức giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleAddPrice} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Từ giờ</label>
            <input type="time" value={priceForm.rangeStart} onChange={(e) => setPriceForm({ ...priceForm, rangeStart: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Đến giờ</label>
            <input type="time" value={priceForm.rangeEnd} onChange={(e) => setPriceForm({ ...priceForm, rangeEnd: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Giá (VNĐ/giờ)</label>
            <input type="number" min="0" required value={priceForm.price} onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })} className="w-32 rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <Button type="submit" size="sm" icon={Plus}>
            Thêm mức giá
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-ink">Khung giờ đặt sân</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {slots.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5 rounded-full bg-surface-variant-2 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-primary-container/60">
              {s.startTime?.slice(0, 5)} - {s.endTime?.slice(0, 5)}
              <button type="button" aria-label="Xoá khung giờ" className="rounded-md p-1 text-ink-soft transition-colors hover:bg-danger-container hover:text-danger" onClick={() => courtApi.deleteTimeSlot(s.id).then(loadAll)}>
                <Trash2 className="size-3.5" />
              </button>
            </span>
          ))}
          {slots.length === 0 && <p className="text-sm text-ink-muted">Chưa có khung giờ nào.</p>}
        </div>
        <form onSubmit={handleAddSlot} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Bắt đầu</label>
            <input type="time" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Kết thúc</label>
            <input type="time" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <Button type="submit" size="sm" icon={Plus}>
            Thêm khung giờ
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-ink">Lịch đóng sân (bảo trì)</h3>
        <div className="mb-4 space-y-2">
          {closures.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-outline-variant px-4 py-2 text-sm">
              <span className="flex items-center gap-2 text-ink">
                <Badge color="warning" variant="soft">
                  Bảo trì
                </Badge>
                {c.startTime?.replace('T', ' ')} → {c.endTime?.replace('T', ' ')}
              </span>
              <button type="button" aria-label="Huỷ lịch đóng sân" className="rounded-md p-1 text-ink-soft transition-colors hover:bg-danger-container hover:text-danger" onClick={() => courtApi.deleteClosure(c.id).then(loadAll)}>
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {closures.length === 0 && <p className="text-sm text-ink-muted">Không có lịch đóng sân nào sắp tới.</p>}
        </div>
        <form onSubmit={handleAddClosure} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Từ</label>
            <input type="datetime-local" required value={closureForm.startTime} onChange={(e) => setClosureForm({ ...closureForm, startTime: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Đến</label>
            <input type="datetime-local" required value={closureForm.endTime} onChange={(e) => setClosureForm({ ...closureForm, endTime: e.target.value })} className="rounded-lg border border-outline px-3 py-2 text-sm transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>
          <Button type="submit" size="sm" icon={Plus}>
            Thêm lịch đóng sân
          </Button>
        </form>
      </Card>
    </div>
  );
}

