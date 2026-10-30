import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Landmark, CircleCheck, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

export default function MockPaymentGateway() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  const booking = location.state?.booking;
  const paymentUrl = location.state?.paymentUrl;

  if (!booking || !paymentUrl) {
    navigate(`/player/checkout/${bookingId}`, { replace: true });
    return null;
  }

  const confirm = (mockStatus) => {
    setProcessing(true);
    const url = new URL(paymentUrl);
    url.searchParams.set('mockStatus', mockStatus);
    window.location.href = url.toString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#a50064] px-4 py-10">
      <Card className="w-full max-w-sm">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={processing}
            className="rounded-md p-1 text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="flex items-center gap-2 font-display text-base font-bold text-[#a50064]">
            <Landmark className="size-5" />
            MoMo
          </span>
          <span className="w-5" />
        </div>

        <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Số tiền thanh toán
        </p>
        <p className="mb-5 text-center font-display text-3xl font-bold text-[#a50064]">
          {formatCurrency(booking.depositAmount)}
        </p>

        <div className="mb-5 space-y-2 rounded-lg bg-surface-variant-2 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Mã đơn</span>
            <span className="font-medium text-ink">#{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Sân</span>
            <span className="font-medium text-ink">{booking.courtName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Ngày chơi</span>
            <span className="font-medium text-ink">{booking.playDate}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="accent"
            icon={CircleCheck}
            className="w-full"
            disabled={processing}
            onClick={() => confirm('SUCCESS')}
          >
            {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
          <Button
            variant="danger"
            icon={XCircle}
            className="w-full"
            disabled={processing}
            onClick={() => confirm('FAILED')}
          >
            Mô phỏng thanh toán thất bại
          </Button>
        </div>
      </Card>
    </div>
  );
}

