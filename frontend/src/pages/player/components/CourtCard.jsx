import { useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { sportImage } from '../../../utils/sportImages';
import { courtApi } from '../../../services/api/courtApi';
import { cn } from '../../../utils/cn';

function formatCurrency(amount) {
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
}

export default function CourtCard({ court, onSelect }) {
  const isActive = court.status === 'ACTIVE';
  const [minPrice, setMinPrice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    courtApi
      .listPrices(court.id)
      .then((prices) => {
        if (cancelled || prices.length === 0) return;
        setMinPrice(Math.min(...prices.map((p) => Number(p.price))));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [court.id]);

  return (
    <div className="group overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-card transition-shadow hover:shadow-primary-lg">
      <div className="relative h-44 overflow-hidden">
        <img
          src={sportImage(court.sportName)}
          alt={court.sportName}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <Badge color="neutral" variant="solid" className="absolute left-3 top-3 !bg-white/95 !text-ink">
          {court.sportName}
        </Badge>
        {isActive ? (
          <Badge color="success" variant="solid" dot className="absolute right-3 top-3">
            Sẵn sàng
          </Badge>
        ) : (
          <Badge color="danger" variant="solid" className="absolute right-3 top-3">
            Tạm ngưng
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-bold text-ink">{court.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
          <MapPin className="size-3.5" />
          Cơ sở NhuToan Sports
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
          {minPrice != null ? (
            <p className="text-sm text-ink-muted">
              Từ <span className="font-display font-bold text-primary">{formatCurrency(minPrice)}</span>/giờ
            </p>
          ) : (
            <span className="h-4 w-24 animate-pulse rounded bg-surface-variant-2" />
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect?.(court)}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors',
            'bg-primary text-white hover:bg-primary-hover'
          )}
        >
          Xem chi tiết &amp; đặt sân
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

