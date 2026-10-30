import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, Pencil, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import ProfileNav from './components/ProfileNav';
import SkillLevelCard from './components/SkillLevelCard';
import FreeTimeGrid from './components/FreeTimeGrid';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../services/api/userApi';
import { playerProfileApi } from '../../services/api/playerProfileApi';
import { courtApi } from '../../services/api/courtApi';

const SKILL_LEVELS = [
  { value: 'BEGINNER', label: 'Mới bắt đầu', description: 'Mới làm quen, chơi giải trí.' },
  { value: 'INTERMEDIATE', label: 'Trung bình', description: 'Đánh ổn định, có kinh nghiệm thi đấu nghiệp dư.' },
  { value: 'ADVANCED', label: 'Nâng cao', description: 'Trình độ thi đấu, cường độ cao.' },
];

const ROLE_LABEL = { PLAYER: 'Player', STAFF: 'Staff', ADMIN: 'Admin' };

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const isPlayer = user?.role === 'PLAYER';

  const TABS = [
    { value: 'personal', label: 'Thông tin cá nhân', icon: UserRound },
    ...(isPlayer ? [{ value: 'preferences', label: 'Sở thích chơi', icon: SlidersHorizontal }] : []),
    { value: 'security', label: 'Bảo mật', icon: ShieldCheck },
  ];
  const [tab, setTab] = useState('personal');

  const [personalForm, setPersonalForm] = useState({ fullName: '', phone: '', dob: '', gender: '' });
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');

  const [sports, setSports] = useState([]);
  const [prefsForm, setPrefsForm] = useState({ favoriteSport: '', yearsExperience: 0, skillLevel: '', freeTimeVector: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState('');

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setPersonalForm({
      fullName: user.fullName ?? '',
      phone: user.phone ?? '',
      dob: user.dob ?? '',
      gender: user.gender ?? '',
    });
  }, [user]);

  useEffect(() => {
    if (!isPlayer) return;
    courtApi.listSports().then(setSports).catch(() => {});
    playerProfileApi
      .getMine()
      .then((profile) => {
        if (!profile) return;
        setPrefsForm({
          favoriteSport: profile.favoriteSport ?? '',
          yearsExperience: profile.yearsExperience ?? 0,
          skillLevel: profile.skillLevel ?? '',
          freeTimeVector: profile.freeTimeVector ?? '',
        });
      })
      .catch(() => {});
  }, [isPlayer]);

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    setPersonalMessage('');
    try {
      await userApi.updateProfile(personalForm);
      await refreshUser();
      setPersonalMessage('Đã lưu thông tin cá nhân.');
    } catch (err) {
      setPersonalMessage(err.response?.data?.message || 'Lưu thất bại, vui lòng thử lại.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await userApi.updateAvatar(file);
      await refreshUser();
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleSavePrefs = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsMessage('');
    try {
      await playerProfileApi.upsertMine({
        ...prefsForm,
        yearsExperience: prefsForm.yearsExperience === '' ? 0 : prefsForm.yearsExperience,
      });
      setPrefsMessage('Đã lưu sở thích chơi.');
    } catch (err) {
      setPrefsMessage(err.response?.data?.message || 'Lưu thất bại, vui lòng thử lại.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới nhập lại không khớp.');
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage('Đổi mật khẩu thành công.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink-muted">Đang tải...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">

      <Card className="mb-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="relative shrink-0">
          <Avatar src={user.avatarUrl} name={user.fullName} size="xl" />
          <label
            aria-label="Đổi ảnh đại diện"
            className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white ring-2 ring-white transition-colors hover:bg-primary-hover"
          >
            <Pencil className="size-3.5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
          </label>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="font-display text-2xl font-bold text-ink">{user.fullName}</h1>
            <Badge color="primary" variant="soft">
              {ROLE_LABEL[user.role] ?? user.role}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
          {avatarUploading && <p className="mt-1 text-xs text-ink-soft">Đang tải ảnh lên...</p>}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-outline px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-danger/40 hover:bg-danger-container hover:text-danger"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </button>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <ProfileNav tabs={TABS} active={tab} onChange={setTab} />

        <div key={tab} className="animate-fade-in">
          {tab === 'personal' && (
            <Card>
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Briefcase className="size-5 text-primary" />
                Thông tin cá nhân
              </h2>

              <form onSubmit={handleSavePersonal}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Họ và tên"
                    value={personalForm.fullName}
                    onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Số điện thoại"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  />
                  <Input
                    label="Ngày sinh"
                    type="date"
                    value={personalForm.dob}
                    onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                  />
                  <Input
                    label="Giới tính"
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                  />
                </div>
                <Input label="Email" type="email" defaultValue={user.email} disabled containerClassName="mt-4" />

                <div className="mt-5 flex items-center justify-end gap-3">
                  {personalMessage && <span className="text-sm text-ink-muted">{personalMessage}</span>}
                  <Button type="submit" rounded="full" disabled={savingPersonal}>
                    {savingPersonal ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {tab === 'preferences' && isPlayer && (
            <Card>
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <SlidersHorizontal className="size-5 text-primary" />
                Sở thích chơi
              </h2>

              <form onSubmit={handleSavePrefs}>
                <p className="mb-2 text-sm font-medium text-ink">Môn yêu thích</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {sports.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPrefsForm({ ...prefsForm, favoriteSport: s.name })}
                      className={
                        prefsForm.favoriteSport === s.name
                          ? 'rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-primary transition-colors'
                          : 'rounded-full border border-outline px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-primary/40 hover:text-ink'
                      }
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                <Input
                  label="Số năm kinh nghiệm"
                  type="number"
                  min={0}
                  value={prefsForm.yearsExperience}
                  onChange={(e) =>
                    setPrefsForm({ ...prefsForm, yearsExperience: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                  containerClassName="mb-5 max-w-xs"
                />

                <p className="mb-2 text-sm font-medium text-ink">Trình độ</p>
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {SKILL_LEVELS.map((level) => (
                    <SkillLevelCard
                      key={level.value}
                      level={level}
                      selected={prefsForm.skillLevel === level.value}
                      onSelect={(value) => setPrefsForm({ ...prefsForm, skillLevel: value })}
                    />
                  ))}
                </div>

                <p className="mb-2 text-sm font-medium text-ink">Khung giờ rảnh (dùng để tìm người ghép cặp)</p>
                <FreeTimeGrid
                  value={prefsForm.freeTimeVector}
                  onChange={(v) => setPrefsForm({ ...prefsForm, freeTimeVector: v })}
                />

                <div className="mt-5 flex items-center justify-end gap-3">
                  {prefsMessage && <span className="text-sm text-ink-muted">{prefsMessage}</span>}
                  <Button type="submit" rounded="full" disabled={savingPrefs}>
                    {savingPrefs ? 'Đang lưu...' : 'Lưu sở thích'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {tab === 'security' && (
            <Card>
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <ShieldCheck className="size-5 text-danger" />
                Bảo mật
              </h2>

              <form onSubmit={handleChangePassword} className="max-w-sm space-y-4">
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />

                {passwordError && <p className="text-sm text-danger">{passwordError}</p>}
                {passwordMessage && <p className="text-sm text-success-dark">{passwordMessage}</p>}

                <Button type="submit" variant="outline" rounded="full" disabled={savingPassword}>
                  {savingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

