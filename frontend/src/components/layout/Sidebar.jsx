import { NavLink } from 'react-router-dom';
import { LogOut, Plus, Trophy } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

export default function Sidebar({ title, subtitle, user, navItems, quickBookingTo, onLogout }) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-variant-2 px-4 py-6">
      <NavLink to="/" className="mb-7 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-primary">
          <Trophy className="size-4" />
        </span>
        <span className="text-display-athletic text-lg text-ink">NhuToan</span>
      </NavLink>

      <div className="mb-6 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-card">
        <Avatar src={user?.avatarUrl} name={user?.name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{title}</p>
          <p className="truncate text-xs text-ink-muted">{subtitle}</p>
        </div>
      </div>

      {quickBookingTo && (
        <Button as={NavLink} to={quickBookingTo} variant="accent" rounded="full" icon={Plus} className="mb-6 w-full">
          Đặt sân nhanh
        </Button>
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-white shadow-primary' : 'text-ink-muted hover:bg-white hover:text-ink'
              )
            }
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-danger-container hover:text-danger"
        >
          <LogOut className="size-[18px]" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

