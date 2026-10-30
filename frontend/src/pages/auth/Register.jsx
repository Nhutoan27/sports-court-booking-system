import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CalendarCheck, Eye, EyeOff, Loader2, Lock, Mail, MessageCircle, Phone, User, Users } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const FEATURES = [
  { icon: CalendarCheck, text: 'Đặt sân cầu lông & pickleball chỉ trong vài bước' },
  { icon: Users, text: 'Ghép cặp đối thủ cùng trình độ bằng AI' },
  { icon: MessageCircle, text: 'Chatbot hỗ trợ giải đáp thắc mắc 24/7' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/player', { replace: true });
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors;
      const firstFieldError = fieldErrors && Object.values(fieldErrors)[0];
      setError(firstFieldError || err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      headline="Tham gia ngay hôm nay"
      subtext="Tạo tài khoản Player miễn phí — đặt sân, ghép cặp và theo dõi lịch chơi của bạn ở một nơi."
      features={FEATURES}
    >
      <Card className="sm:p-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Tạo tài khoản</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Tài khoản mới luôn là Player — Staff do Admin tạo riêng.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <Input
            id="fullName"
            name="fullName"
            icon={User}
            label="Họ tên"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
            required
          />
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
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
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
          <Input
            id="phone"
            name="phone"
            icon={Phone}
            label="Số điện thoại (không bắt buộc)"
            placeholder="09xx xxx xxx"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />

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
              {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </span>
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-ink-muted">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline">
            Đăng nhập
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

