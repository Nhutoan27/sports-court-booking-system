import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import PlayerLayout from '../components/layout/PlayerLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import { STAFF_NAV, ADMIN_NAV } from './navConfig';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import HomeSearch from '../pages/player/HomeSearch';
import BookingDetail from '../pages/player/BookingDetail';
import DepositPayment from '../pages/player/DepositPayment';
import MockPaymentGateway from '../pages/player/MockPaymentGateway';
import BookingHistory from '../pages/player/BookingHistory';
import MatchInvitations from '../pages/player/MatchInvitations';
import AIMatchmaking from '../pages/player/AIMatchmaking';
import Profile from '../pages/player/Profile';

import DailyBookings from '../pages/staff/DailyBookings';
import CourtStatus from '../pages/staff/CourtStatus';

import Dashboard from '../pages/admin/Dashboard';
import BookingsManagement from '../pages/admin/BookingsManagement';
import CourtsPricing from '../pages/admin/CourtsPricing';
import AccountsManagement from '../pages/admin/AccountsManagement';
import KnowledgeBaseManagement from '../pages/admin/KnowledgeBaseManagement';
import SystemConfigManagement from '../pages/admin/SystemConfigManagement';

function PortalLayout({ title, subtitle, navItems, quickBookingTo }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      user={{ name: user?.fullName, avatarUrl: user?.avatarUrl }}
      navItems={navItems}
      quickBookingTo={quickBookingTo}
      onLogout={handleLogout}
    />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/player" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<PrivateRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={['PLAYER']} />}>
          <Route path="/player/checkout/:bookingId" element={<DepositPayment />} />

          <Route path="/player/checkout/:bookingId/gateway" element={<MockPaymentGateway />} />
        </Route>
      </Route>

      <Route element={<PlayerLayout />}>
        <Route path="/player" element={<HomeSearch />} />
        <Route path="/player/courts/:id" element={<BookingDetail />} />

        <Route element={<PrivateRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={['PLAYER']} />}>
            <Route path="/player/bookings" element={<BookingHistory />} />
            <Route path="/player/invitations" element={<MatchInvitations />} />
            <Route path="/player/matchmaking" element={<AIMatchmaking />} />
            <Route path="/player/profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={['STAFF']} />}>
          <Route
            element={
              <PortalLayout title="Cổng nhân viên" subtitle="Nhân viên NhuToan" navItems={STAFF_NAV} quickBookingTo="/staff" />
            }
          >
            <Route path="/staff" element={<DailyBookings />} />
            <Route path="/staff/court-status" element={<CourtStatus />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
          <Route
            element={
              <PortalLayout title="Cổng quản trị" subtitle="Quản trị viên NhuToan" navItems={ADMIN_NAV} />
            }
          >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/bookings" element={<BookingsManagement />} />
            <Route path="/admin/courts" element={<CourtsPricing />} />
            <Route path="/admin/accounts" element={<AccountsManagement />} />
            <Route path="/admin/knowledge-base" element={<KnowledgeBaseManagement />} />
            <Route path="/admin/system-config" element={<SystemConfigManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/player" replace />} />
    </Routes>
  );
}

