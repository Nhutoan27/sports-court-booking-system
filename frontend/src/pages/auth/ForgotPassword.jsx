import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { authApi } from '../../services/api/authApi';

const RESEND_COOLDOWN_SECONDS = 30;

const FEATURES = [
  { icon: Mail, text: 'Mã OTP xác thực được gửi trực tiếp tới email của bạn' },
  { icon: ShieldCheck, text: 'Không giới hạn số lần nhập lại nếu gõ sai mã' },
  { icon: Lock, text: 'Mật khẩu mới được mã hoá và lưu trữ an toàn' },
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');

  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async () => {
    await authApi.forgotPassword(email);
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setRequesting(true);
    setRequestError('');
    try {
      await requestOtp();
      setStep('reset');
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Không gửi được mã OTP, vui lòng thử lại.');
    } finally {
      setRequesting(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    setResetError('');
    try {
      await requestOtp();
      setResendMessage('Đã gửi lại mã OTP mới.');
    } catch (err) {
      setResetError(err.response?.data?.message || 'Không gửi lại được mã OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (newPassword !== confirmPassword) {
      setResetError('Mật khẩu mới nhập lại không khớp.');
      return;
    }
    setResetting(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setResetSuccess(true);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại, vui lòng thử lại.');
    } finally {
      setResetting(false);
    }
  };

  if (resetSuccess) {
    return (
      <AuthLayout headline="Khôi phục quyền truy cập" subtext="Chỉ vài bước để lấy lại mật khẩu và tiếp tục đặt sân." features={FEATURES}>
        <Card className="text-center sm:p-8">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10 animate-fade-in">
            <CheckCircle2 className="size-8 text-success-dark" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Đặt lại mật khẩu thành công</h1>
          <p className="mt-2 text-sm text-ink-muted">Bạn có thể đăng nhập lại bằng mật khẩu mới.</p>
          <Button className="mt-7 w-full" size="lg" onClick={() => navigate('/login', { replace: true })}>
            Về trang đăng nhập
          </Button>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout headline="Khôi phục quyền truy cập" subtext="Chỉ vài bước để lấy lại mật khẩu và tiếp tục đặt sân." features={FEATURES}>
      <Card className="sm:p-8">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary-container">
          {step === 'request' ? (
            <Mail className="size-6 text-primary" />
          ) : (
            <ShieldCheck className="size-6 text-primary" />
          )}
        </div>

        <h1 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">Quên mật khẩu</h1>
        <p className="mt-1.5 text-center text-sm text-ink-muted">
          {step === 'request'
            ? 'Nhập email đã đăng ký, mã OTP sẽ được gửi tới đó.'
            : `Nhập mã OTP vừa gửi tới ${email} và mật khẩu mới.`}
        </p>

        <div className="mx-auto mt-5 flex w-full max-w-[220px] items-center gap-2">
          <div className={cn('h-1.5 flex-1 rounded-full transition-colors', step === 'request' || step === 'reset' ? 'bg-primary' : 'bg-outline-variant')} />
          <div className={cn('h-1.5 flex-1 rounded-full transition-colors', step === 'reset' ? 'bg-primary' : 'bg-outline-variant')} />
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestOtp} className="mt-7 space-y-4" noValidate>
            <Input
              id="email"
              type="email"
              icon={Mail}
              label="Email"
              placeholder="ban@vidu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            {requestError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-container px-3.5 py-2.5 text-sm text-danger-on-container animate-fade-in"
              >
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <span>{requestError}</span>
              </div>
            )}

            <Button type="submit" size="lg" rounded="full" className="w-full" disabled={requesting}>
              <span className="inline-flex items-center gap-2">
                {requesting && <Loader2 className="size-4 animate-spin" />}
                {requesting ? 'Đang gửi...' : 'Gửi mã OTP'}
              </span>
            </Button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-ink">
                Mã OTP
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  required
                  className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-3 text-center text-lg font-semibold tracking-[0.5em] text-ink placeholder:tracking-normal placeholder:text-ink-soft transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              icon={Lock}
              label="Mật khẩu mới"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword((s) => !s)}
                  className="rounded-md p-1 text-ink-soft transition-colors hover:text-ink"
                  aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={Lock}
              label="Nhập lại mật khẩu mới"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="rounded-md p-1 text-ink-soft transition-colors hover:text-ink"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />

            {resetError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-container px-3.5 py-2.5 text-sm text-danger-on-container animate-fade-in"
              >
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}
            {resendMessage && !resetError && <p className="text-sm text-success-dark">{resendMessage}</p>}

            <Button type="submit" size="lg" rounded="full" className="w-full" disabled={resetting}>
              <span className="inline-flex items-center gap-2">
                {resetting && <Loader2 className="size-4 animate-spin" />}
                {resetting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </span>
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setStep('request')} className="text-ink-muted hover:text-ink hover:underline">
                Nhập sai email? Quay lại
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className={cn(
                  'flex items-center gap-1 font-medium transition-colors',
                  cooldown > 0 ? 'cursor-not-allowed text-ink-soft' : 'text-primary hover:text-primary-hover hover:underline'
                )}
              >
                <RefreshCw className="size-3.5" />
                {cooldown > 0 ? `Gửi lại (${cooldown}s)` : 'Gửi lại mã'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-7 text-center text-sm text-ink-muted">
          Nhớ lại mật khẩu?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline">
            Đăng nhập
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

