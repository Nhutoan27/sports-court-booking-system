import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarPlus, LogIn, Trophy } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { label: 'Tìm sân', to: '/player' },
  { label: 'Đặt sân của tôi', to: '/player/bookings' },
  { label: 'Ghép cặp', to: '/player/matchmaking' },
  { label: 'Lời mời', to: '/player/invitations' },
];

export default function PlayerHeader({ user }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <NavLink to="/player" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-primary">
            <Trophy className="size-4" />
          </span>
          <span className="text-display-athletic text-lg text-ink">NhuToan</span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/player'}
              className={({ isActive }) =>
                cn(
                  'border-b-2 pb-1 text-sm font-medium transition-colors',
                  isActive ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                size="sm"
                rounded="full"
                icon={CalendarPlus}
                className="hidden sm:inline-flex"
                onClick={() => navigate('/player')}
              >
                Đặt sân
              </Button>
              <NavLink to="/player/profile">
                <Avatar src={user.avatarUrl} name={user.name} size="md" />
              </NavLink>
            </>
          ) : (

            <Button size="sm" rounded="full" icon={LogIn} onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

