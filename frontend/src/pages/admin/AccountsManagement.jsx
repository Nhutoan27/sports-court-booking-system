import { useEffect, useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import AccountsTable from './components/AccountsTable';
import { userApi } from '../../services/api/userApi';

export default function AccountsManagement() {
  const [role, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ content: [], totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = () => {
    setLoading(true);
    userApi
      .listAll({ role: role === 'all' ? undefined : role, page, size: 20 })
      .then(setPageData)
      .catch(() => setError('Không tải được danh sách tài khoản.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [role, page]);

  const filtered = pageData.content.filter((a) => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return a.fullName.toLowerCase().includes(term) || a.email.toLowerCase().includes(term);
  });

  const handleToggleStatus = async (account) => {
    const nextStatus = account.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    try {
      await userApi.updateStatus(account.id, nextStatus);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật trạng thái thất bại.');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await userApi.createStaff(createForm);
      setShowCreate(false);
      setCreateForm({ fullName: '', email: '', password: '', phone: '' });
      setRole('STAFF');
      setPage(0);
      load();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Tạo tài khoản Staff thất bại.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Quản lý tài khoản</h1>
          <p className="mt-1 text-ink-muted">Quản lý vai trò và quyền truy cập của người dùng.</p>
        </div>
        <Button icon={UserPlus} onClick={() => setShowCreate(true)}>
          Tạo tài khoản Staff
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-outline-variant bg-white p-3 shadow-card">
        <Input
          icon={Search}
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="flex-1 min-w-[220px]"
        />
        <Select
          value={role}
          onChange={(e) => {
            setPage(0);
            setRole(e.target.value);
          }}
          containerClassName="w-40"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="PLAYER">Player</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
      {!loading && filtered.length === 0 && <p className="text-sm text-ink-muted">Không có tài khoản nào phù hợp.</p>}
      {!loading && filtered.length > 0 && <AccountsTable accounts={filtered} onToggleStatus={handleToggleStatus} />}

      <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
        <span>Tổng {pageData.totalElements} tài khoản</span>
        <Pagination page={page + 1} totalPages={pageData.totalPages || 1} onPageChange={(p) => setPage(p - 1)} />
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Tạo tài khoản Staff</h2>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                aria-label="Đóng"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink-muted">Staff không tự đăng ký được — chỉ Admin tạo tài khoản.</p>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <Input
                label="Họ và tên"
                required
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
              <Input
                label="Mật khẩu"
                type="password"
                required
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
              <Input
                label="Số điện thoại"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />

              {createError && <p className="text-sm text-danger">{createError}</p>}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Huỷ
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Đang tạo...' : 'Tạo tài khoản'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

