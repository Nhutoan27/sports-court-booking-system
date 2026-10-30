import { Lock, Unlock } from 'lucide-react';
import Avatar from '../../../components/common/Avatar';
import Badge from '../../../components/common/Badge';
import { cn } from '../../../utils/cn';

const ROLE_LABEL = { PLAYER: 'Player', STAFF: 'Staff', ADMIN: 'Admin' };
const ROLE_COLOR = { PLAYER: 'neutral', STAFF: 'neutral', ADMIN: 'warning' };

export default function AccountsTable({ accounts, onToggleStatus }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-variant-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <th className="px-5 py-3">Người dùng</th>
            <th className="px-5 py-3">Vai trò</th>
            <th className="px-5 py-3">Trạng thái</th>
            <th className="px-5 py-3">SĐT</th>
            <th className="px-5 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const locked = account.status === 'LOCKED';
            return (
              <tr key={account.id} className="border-b border-outline-variant transition-colors last:border-0 hover:bg-surface-variant-2/60">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={account.avatarUrl} name={account.fullName} size="sm" />
                    <div>
                      <p className="font-medium text-ink">{account.fullName}</p>
                      <p className="text-xs text-ink-muted">{account.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge color={ROLE_COLOR[account.role]} variant="soft">
                    {ROLE_LABEL[account.role] ?? account.role}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge color={locked ? 'danger' : 'primary'} variant="soft" dot>
                    {locked ? 'Locked' : 'Active'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-ink-muted">{account.phone || '—'}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3 text-ink-muted">
                    <button
                      type="button"
                      aria-label={locked ? `Mở khoá ${account.fullName}` : `Khoá ${account.fullName}`}
                      onClick={() => onToggleStatus?.(account)}
                      className={cn(
                        'rounded-full p-1.5 transition-colors',
                        locked ? 'text-primary hover:bg-primary-container' : 'text-ink-muted hover:bg-surface-variant-2 hover:text-primary'
                      )}
                    >
                      {locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

