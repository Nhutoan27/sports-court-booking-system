import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from './components/StatCard';
import WeeklyRevenueChart from './components/WeeklyRevenueChart';
import SportPopularityDonut from './components/SportPopularityDonut';
import ActivityList from './components/ActivityList';
import { bookingApi } from '../../services/api/bookingApi';
import { courtApi } from '../../services/api/courtApi';
import { userApi } from '../../services/api/userApi';

const DONUT_COLORS = ['#2563EB', '#1E40AF', '#84CC16', '#94A3B8'];
const ACTIVE_STATUSES = ['CONFIRMED', 'CHECKED_IN', 'COMPLETED'];
const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

function formatCurrency(amount) {
  return `${Number(amount ?? 0).toLocaleString('vi-VN')}đ`;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [slotCountByCourtId, setSlotCountByCourtId] = useState(new Map());
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = todayIso();

  useEffect(() => {
    Promise.all([
      bookingApi.listAll({ size: 500 }),
      courtApi.listCourts(),
      userApi.listAll({ role: 'PLAYER', size: 5 }),
    ])
      .then(async ([bookingsRes, courtsRes, playersRes]) => {
        setBookings(bookingsRes.content);
        setCourts(courtsRes);
        setRecentPlayers(playersRes.content);

        const slotLists = await Promise.all(courtsRes.map((c) => courtApi.listTimeSlots(c.id)));
        setSlotCountByCourtId(new Map(courtsRes.map((c, i) => [c.id, slotLists[i].length])));
      })

      .catch(() => setError('Không tải được dữ liệu tổng quan, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const todayBookings = bookings.filter((b) => b.playDate === today);
    let todayRevenue = 0;
    for (const b of bookings) {
      if (b.paymentStatus === 'SUCCESS' && b.createdAt?.slice(0, 10) === today) {
        todayRevenue += Number(b.depositAmount);
      }
    }
    const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
    let totalSlotsToday = 0;
    for (const c of courts) {
      totalSlotsToday += slotCountByCourtId.get(c.id) ?? 0;
    }
    const bookedSlotsToday = todayBookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
    const occupancy = totalSlotsToday > 0 ? Math.round((bookedSlotsToday / totalSlotsToday) * 100) : 0;
    const noShowToday = todayBookings.filter((b) => b.status === 'NO_SHOW').length;

    return [
      { key: 'revenue', label: 'Doanh thu tiền cọc hôm nay', value: formatCurrency(todayRevenue) },
      { key: 'bookings', label: 'Tổng số booking', value: String(bookings.length), helper: `${pendingCount} đang chờ thanh toán cọc` },
      { key: 'occupancy', label: 'Tỷ lệ lấp đầy hôm nay', value: `${occupancy}%`, progress: occupancy },
      { key: 'noshows', label: 'No-show hôm nay', value: String(noShowToday), helper: noShowToday > 0 ? 'Cần theo dõi' : undefined, alert: noShowToday > 0 },
    ];
  }, [bookings, courts, slotCountByCourtId, today]);

  const weeklyRevenue = useMemo(() => {
    const buckets = new Array(7).fill(0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    for (const b of bookings) {
      if (b.paymentStatus !== 'SUCCESS' || !b.createdAt) continue;
      const created = new Date(b.createdAt);
      if (created < sevenDaysAgo) continue;
      buckets[created.getDay()] += Number(b.depositAmount);
    }

    const todayIdx = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const dayIdx = (todayIdx - 6 + i + 7) % 7;
      return { day: WEEKDAY_LABELS[dayIdx], value: buckets[dayIdx] };
    });
  }, [bookings]);

  const sportPopularity = useMemo(() => {
    const courtSportName = new Map(courts.map((c) => [c.id, c.sportName]));
    const counts = new Map();
    for (const b of bookings) {
      if (b.status === 'CANCELLED') continue;
      const sportName = courtSportName.get(b.courtId) ?? 'Khác';
      counts.set(sportName, (counts.get(sportName) ?? 0) + 1);
    }
    let total = 0;
    for (const v of counts.values()) {
      total += v;
    }
    total = total || 1;
    return [...counts.entries()].map(([sport, count], i) => ({
      sport,
      percent: Math.round((count / total) * 100),
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [bookings, courts]);

  const recentActivity = useMemo(() => {
    const bookingItems = bookings.slice(0, 8).map((b) => ({
      id: `booking-${b.id}`,
      type: b.status === 'CANCELLED' || b.status === 'NO_SHOW' ? 'cancellation' : 'new-booking',
      title: `Booking #${b.id}: ${b.courtName}`,
      subtitle: `${b.userName} — ${b.status}`,
      createdAt: b.createdAt,
    }));
    const playerItems = recentPlayers.map((p) => ({
      id: `player-${p.id}`,
      type: 'signup',
      title: 'Tài khoản Player mới',
      subtitle: `${p.fullName} vừa đăng ký`,
      createdAt: p.createdAt,
    }));
    return [...bookingItems, ...playerItems]
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      .slice(0, 6)
      .map((item) => ({ ...item, time: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '' }));
  }, [bookings, recentPlayers]);

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Tổng quan</h1>
          <p className="mt-1 text-ink-muted">Tình hình hoạt động của cơ sở hôm nay.</p>
        </div>
        <span className="flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 text-sm font-medium text-ink">
          <Calendar className="size-4 text-ink-muted" />
          {today}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Đang tải...</p>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.key} stat={stat} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <Card>
              <h2 className="mb-4 font-display text-xl font-bold text-ink">Doanh thu cọc 7 ngày qua</h2>
              <WeeklyRevenueChart data={weeklyRevenue} />
            </Card>

            <Card>
              <h2 className="mb-4 font-display text-xl font-bold text-ink">Tỷ lệ theo môn thể thao</h2>
              {sportPopularity.length > 0 ? (
                <SportPopularityDonut data={sportPopularity} />
              ) : (
                <p className="text-sm text-ink-muted">Chưa có dữ liệu.</p>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <h2 className="mb-2 font-display text-xl font-bold text-ink">Hoạt động gần đây</h2>
            {recentActivity.length > 0 ? (
              <ActivityList items={recentActivity} />
            ) : (
              <p className="text-sm text-ink-muted">Chưa có hoạt động nào.</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

