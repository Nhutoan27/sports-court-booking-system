import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout({ title, subtitle, user, navItems, quickBookingTo, onLogout }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        title={title}
        subtitle={subtitle}
        user={user}
        navItems={navItems}
        quickBookingTo={quickBookingTo}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

