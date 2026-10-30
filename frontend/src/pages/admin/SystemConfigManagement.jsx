import { useEffect, useState } from 'react';
import { AlertTriangle, Clock3, History, Percent, Save, Settings, Timer } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { cn } from '../../utils/cn';
import { systemConfigApi } from '../../services/api/systemConfigApi';

function toDateTimeLocalValue(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}

const METRICS = [
  { key: 'depositPercentage', label: 'Tiền cọc', icon: Percent, suffix: '%', color: 'primary' },
  { key: 'cancelHours', label: 'Cửa sổ huỷ', icon: Clock3, suffix: ' giờ', color: 'secondary' },
  { key: 'holdMinutes', label: 'Giữ chỗ tạm', icon: Timer, suffix: ' phút', color: 'warning' },
  { key: 'noShowMinutes', label: 'Chờ no-show', icon: AlertTriangle, suffix: ' phút', color: 'danger' },
];

const METRIC_ICON_BG = {
  primary: 'bg-primary-container text-primary',
  secondary: 'bg-surface-variant-2 text-secondary',
  warning: 'bg-warning-container text-warning-dark',
  danger: 'bg-danger-container text-danger',
};

export default function SystemConfigManagement() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([systemConfigApi.getCurrent(), systemConfigApi.getHistory()])
      .then(([currentRes, historyRes]) => {
        setCurrent(currentRes);
        setHistory(historyRes);
        setForm({
          depositPercentage: currentRes?.depositPercentage ?? 30,
          cancelHours: currentRes?.cancelHours ?? 2,
          holdMinutes: currentRes?.holdMinutes ?? 5,
          noShowMinutes: currentRes?.noShowMinutes ?? 15,
          effectiveFrom: toDateTimeLocalValue(new Date()),
        });
      })
      .catch(() => setError('Không tải được cấu hình hệ thống.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setSuccessMsg('');
    try {
      await systemConfigApi.create({
        depositPercentage: Number(form.depositPercentage),
        cancelHours: Number(form.cancelHours),
        holdMinutes: Number(form.holdMinutes),
        noShowMinutes: Number(form.noShowMinutes),
        effectiveFrom: `${form.effectiveFrom}:00`,
      });
      setSuccessMsg('Đã tạo bản ghi cấu hình mới — có hiệu lực từ thời điểm đã chọn, không ảnh hưởng booking cũ.');
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Tạo cấu hình mới thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-ink-muted">Đang tải...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
            <Settings className="size-5" />
          </span>
          Cấu hình hệ thống
        </h1>
        <p className="mt-2 text-ink-muted">
          Thay đổi ở đây áp dụng cho toàn hệ thống — mỗi lần lưu tạo 1 bản ghi mới, có hiệu lực từ
          thời điểm chọn trở đi, <strong className="text-ink">không hồi tố</strong> các booking đã tạo trước đó.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {current ? (
        <>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
            Đang áp dụng — hiệu lực từ {formatDateTime(current.effectiveFrom)}
          </p>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map(({ key, label, icon: Icon, suffix, color }) => (
              <Card key={key} className="transition-shadow hover:shadow-soft">
                <div className="mb-3 flex items-start justify-between">
                  <p className="text-sm text-ink-muted">{label}</p>
                  <span className={cn('flex size-9 items-center justify-center rounded-lg', METRIC_ICON_BG[color])}>
                    <Icon className="size-4" />
                  </span>
                </div>
                <p className="font-display text-3xl font-bold text-ink">
                  {current[key]}
                  <span className="text-lg font-semibold text-ink-muted">{suffix}</span>
                </p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="mb-6 text-sm text-ink-muted">
          Chưa có cấu hình nào — hệ thống đang chạy giá trị mặc định trong code.
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Tạo cấu hình mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Tiền cọc (%)"
              icon={Percent}
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.depositPercentage}
              onChange={(e) => setForm({ ...form, depositPercentage: e.target.value })}
            />
            <Input
              label="Cửa sổ huỷ (giờ)"
              icon={Clock3}
              type="number"
              min="0"
              required
              value={form.cancelHours}
              onChange={(e) => setForm({ ...form, cancelHours: e.target.value })}
            />
            <Input
              label="Giữ chỗ tạm (phút)"
              icon={Timer}
              type="number"
              min="1"
              required
              value={form.holdMinutes}
              onChange={(e) => setForm({ ...form, holdMinutes: e.target.value })}
            />
            <Input
              label="Chờ no-show (phút)"
              icon={AlertTriangle}
              type="number"
              min="0"
              required
              value={form.noShowMinutes}
              onChange={(e) => setForm({ ...form, noShowMinutes: e.target.value })}
            />
          </div>

          <Input
            label="Có hiệu lực từ"
            type="datetime-local"
            required
            containerClassName="max-w-xs"
            value={form.effectiveFrom}
            onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
          />

          {formError && <p className="text-sm text-danger">{formError}</p>}
          {successMsg && <p className="text-sm text-success-dark">{successMsg}</p>}

          <div className="flex justify-end">
            <Button type="submit" icon={Save} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cấu hình mới'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <History className="size-5 text-primary" />
          Lịch sử cấu hình
        </h2>
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant-2 text-xs font-semibold uppercase text-ink-muted">
                <th className="px-4 py-2.5">Hiệu lực từ</th>
                <th className="px-4 py-2.5">Cọc</th>
                <th className="px-4 py-2.5">Giờ huỷ</th>
                <th className="px-4 py-2.5">Giữ chỗ</th>
                <th className="px-4 py-2.5">No-show</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-outline-variant transition-colors last:border-0 hover:bg-surface-variant-2/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {formatDateTime(h.effectiveFrom)}
                      {current?.id === h.id && (
                        <Badge color="primary" variant="soft">
                          Đang áp dụng
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{h.depositPercentage}%</td>
                  <td className="px-4 py-3">{h.cancelHours} giờ</td>
                  <td className="px-4 py-3">{h.holdMinutes} phút</td>
                  <td className="px-4 py-3">{h.noShowMinutes} phút</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-ink-muted">
                    Chưa có bản ghi nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

