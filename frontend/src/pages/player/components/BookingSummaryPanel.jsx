import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

export default function BookingSummaryPanel({
  courtName,
  playDate,
  selectedSlots,
  totalPrice,
  depositAmount,
  depositPercent = 30,
  onCheckout,
  submitting,
}) {
  const hasSelection = selectedSlots.length > 0;

  return (
    <Card className="sticky top-6">
      <h2 className="mb-1 font-display text-xl font-bold text-ink">Tóm tắt đặt sân</h2>
      <p className="mb-4 text-sm text-ink-muted">
        {courtName} · {playDate}
      </p>

      <div className="mb-4 rounded-xl bg-surface-variant-2 p-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Clock className="size-3.5" />
          Khung giờ đã chọn
        </p>
        {hasSelection ? (
          <div className="flex flex-wrap gap-2">
            {selectedSlots.map((slot) => (
              <span key={slot} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-primary shadow-card">
                {slot}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Chưa chọn khung giờ nào — chọn ở lưới bên trái.</p>
        )}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Số giờ</dt>
          <dd className="font-medium text-ink">{selectedSlots.length} giờ</dd>
        </div>
      </dl>

      <div className="my-4 flex justify-between border-t border-outline-variant pt-4">
        <span className="font-display text-lg font-bold text-ink">Tổng tiền</span>
        <span className="font-display text-lg font-bold text-ink">{formatCurrency(totalPrice)}</span>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-lg bg-primary-container/50 px-4 py-3">
        <p className="text-xs font-medium text-primary-on-container">Tiền cọc cần thanh toán ({depositPercent}%)</p>
        <span className="font-display text-lg font-bold text-primary">{formatCurrency(depositAmount)}</span>
      </div>

      <Button
        variant="accent"
        size="lg"
        rounded="full"
        icon={ArrowRight}
        iconPosition="right"
        className="w-full"
        disabled={!hasSelection || submitting}
        onClick={onCheckout}
      >
        {submitting ? 'Đang xử lý...' : 'Xác nhận & thanh toán cọc'}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        Giữ chỗ tạm 5 phút để hoàn tất thanh toán. Huỷ miễn phí trước giờ chơi 2 tiếng.
      </p>
    </Card>
  );
}

