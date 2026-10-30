import { Outlet } from 'react-router-dom';
import PlayerHeader from './PlayerHeader';
import Footer from './Footer';
import ChatbotFAB from './ChatbotFAB';
import { useAuth } from '../../hooks/useAuth';

export default function PlayerLayout() {
  const { user } = useAuth();

  const headerUser = user ? { name: user.fullName, avatarUrl: user.avatarUrl } : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PlayerHeader user={headerUser} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotFAB />
    </div>
  );
}

