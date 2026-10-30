import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const HOME_BY_ROLE = { ADMIN: '/admin', STAFF: '/staff', PLAYER: '/player' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const home = HOME_BY_ROLE[user.role] || '/player';
      const from = location.state?.from?.pathname;

      navigate(from?.startsWith(home) ? from : home, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout headline="Đặt sân trong tích tắc">
      <Card className="sm:p-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Chào mừng trở lại</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Đăng nhập để đặt sân — dùng chung cho Player/Staff/Admin.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            icon={Mail}
            label="Email"
            placeholder="ban@vidu.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            label="Mật khẩu"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="rounded-md p-1 text-ink-soft transition-colors hover:text-ink"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-container px-3.5 py-2.5 text-sm text-danger-on-container animate-fade-in"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" size="lg" rounded="full" className="w-full" disabled={submitting}>
            <span className="inline-flex items-center gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </span>
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-ink-muted">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-hover hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

