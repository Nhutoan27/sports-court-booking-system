import { useEffect, useState } from 'react';
import { Sparkles, Cake, BarChart3, Search, Users2, X } from 'lucide-react';
import SegmentedControl from '../../components/common/SegmentedControl';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import CompactMatchCard from './components/CompactMatchCard';
import SkillLevelCard from './components/SkillLevelCard';
import FreeTimeGrid from './components/FreeTimeGrid';
import { courtApi } from '../../services/api/courtApi';
import { matchingApi } from '../../services/api/matchingApi';

const SKILL_LEVELS = [
  { value: 'BEGINNER', label: 'Mới bắt đầu', description: 'Mới làm quen, chơi giải trí.' },
  { value: 'INTERMEDIATE', label: 'Trung bình', description: 'Đánh ổn định, có kinh nghiệm nghiệp dư.' },
  { value: 'ADVANCED', label: 'Nâng cao', description: 'Trình độ thi đấu, cường độ cao.' },
];
const SKILL_LABEL = {};
for (const level of SKILL_LEVELS) {
  SKILL_LABEL[level.value] = level.label;
}

function toMatchCardShape(candidate) {
  return {
    id: candidate.candidateUserId,
    name: candidate.candidateFullName,
    avatarUrl: candidate.candidateAvatarUrl,
    matchPercent: Math.round(candidate.similarityScore * 100),
  };
}

export default function AIMatchmaking() {
  const [sports, setSports] = useState([]);
  const [sportId, setSportId] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitedIds, setInvitedIds] = useState(new Set());

  const [form, setForm] = useState({ age: 25, experience: 0, skillLevel: '', freeTimeVector: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    courtApi.listSports().then((res) => {
      const active = res.filter((s) => s.status === 'ACTIVE');
      setSports(active);
      if (active.length > 0) setSportId(active[0].id);
    });
  }, []);

  useEffect(() => {
    if (!sportId) return;
    setLoading(true);
    setError('');
    setCandidates([]);
    matchingApi
      .listMyRequests({ size: 50 })
      .then((page) => {
        const found = page.content.find((r) => r.sportId === sportId && r.status === 'DANG_TIM');
        setActiveRequest(found ?? null);
        if (found) {
          return matchingApi.findCandidates(found.id).then(setCandidates);
        }
        return null;
      })
      .catch(() => setError('Không tải được dữ liệu ghép cặp, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [sportId]);

  const handleCreateRequest = async () => {
    if (!form.skillLevel) return;
    setCreating(true);
    setError('');
    try {
      const request = await matchingApi.createRequest({
        sportId,
        ...form,
        age: form.age === '' ? 0 : form.age,
        experience: form.experience === '' ? 0 : form.experience,
      });
      setActiveRequest(request);
      const found = await matchingApi.findCandidates(request.id);
      setCandidates(found);
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo yêu cầu ghép cặp thất bại.');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    await matchingApi.cancelRequest(activeRequest.id);
    setActiveRequest(null);
    setCandidates([]);
  };

  const handleInvite = async (candidate) => {
    try {
      await matchingApi.sendInvitation({ sportId, receiverUserId: candidate.candidateUserId });
      setInvitedIds((prev) => new Set(prev).add(candidate.candidateUserId));
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi lời mời thất bại.');
    }
  };

  const sportOptions = sports.map((s) => ({ value: s.id, label: s.name }));
  const matches = candidates.map(toMatchCardShape);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="flex items-center gap-2.5 font-display text-2xl font-bold text-ink">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
          <Sparkles className="size-5" />
        </span>
        Tìm người ghép cặp (AI)
      </h1>
      <p className="mt-2 text-ink-muted">Tìm bạn chơi cùng phù hợp dựa trên trình độ và khung giờ rảnh.</p>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-ink">
              <Users2 className="size-4 text-primary" />
              Tiêu chí ghép cặp
            </h2>

            {sportOptions.length > 0 && (
              <SegmentedControl options={sportOptions} value={sportId} onChange={setSportId} className="mb-4 w-full" />
            )}

            {loading ? (
              <p className="text-sm text-ink-muted">Đang tải...</p>
            ) : activeRequest ? (
              <div className="animate-fade-in space-y-4">
                <div className="rounded-lg bg-primary-container/30 p-3 text-sm text-primary-on-container">
                  Đang tìm — {candidates.length} gợi ý phù hợp.
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Trình độ</dt>
                    <dd className="font-medium text-ink">{SKILL_LABEL[activeRequest.skillLevel] ?? activeRequest.skillLevel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Kinh nghiệm</dt>
                    <dd className="font-medium text-ink">{activeRequest.experience} năm</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Tuổi</dt>
                    <dd className="font-medium text-ink">{activeRequest.age}</dd>
                  </div>
                </dl>
                <Button variant="outline" icon={X} className="w-full" rounded="full" onClick={handleCancelRequest}>
                  Huỷ tìm kiếm
                </Button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <Input
                    label="Tuổi"
                    icon={Cake}
                    type="number"
                    min={0}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value === '' ? '' : Number(e.target.value) })}
                  />
                  <Input
                    label="Số năm kinh nghiệm"
                    icon={BarChart3}
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value === '' ? '' : Number(e.target.value) })}
                  />
                </div>

                <p className="mb-2 mt-4 text-sm font-medium text-ink">Trình độ</p>
                <div className="mb-4 grid grid-cols-1 gap-2.5">
                  {SKILL_LEVELS.map((level) => (
                    <SkillLevelCard
                      key={level.value}
                      level={level}
                      selected={form.skillLevel === level.value}
                      onSelect={(value) => setForm({ ...form, skillLevel: value })}
                    />
                  ))}
                </div>

                <p className="mb-2 text-sm font-medium text-ink">Khung giờ rảnh</p>
                <FreeTimeGrid value={form.freeTimeVector} onChange={(v) => setForm({ ...form, freeTimeVector: v })} />

                <Button
                  className="mt-5 w-full"
                  rounded="full"
                  icon={Search}
                  disabled={!form.skillLevel || creating}
                  onClick={handleCreateRequest}
                >
                  {creating ? 'Đang tìm...' : 'Bắt đầu tìm'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div key={activeRequest ? 'results' : 'empty'} className="animate-fade-in">
          {!loading && !activeRequest && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-variant-2/40 py-20 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-container text-primary">
                <Sparkles className="size-6" />
              </span>
              <p className="font-medium text-ink">Chưa có tìm kiếm nào đang chạy.</p>
              <p className="max-w-xs text-sm text-ink-muted">Điền tiêu chí bên trái và bấm &quot;Bắt đầu tìm&quot; để AI gợi ý người chơi phù hợp.</p>
            </div>
          )}

          {!loading && activeRequest && matches.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-variant-2/40 py-20 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-surface-variant-2 text-ink-soft">
                <Users2 className="size-6" />
              </span>
              <p className="text-sm text-ink-muted">Chưa tìm thấy người chơi phù hợp, thử lại sau.</p>
            </div>
          )}

          {!loading && activeRequest && matches.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-ink">Gợi ý phù hợp</h2>
                <Badge color="primary" variant="soft">
                  {matches.length} người chơi
                </Badge>
              </div>
              <div className="space-y-3">
                {matches.map((match, idx) => (
                  <CompactMatchCard
                    key={match.id}
                    match={match}
                    onInvite={() => handleInvite(candidates[idx])}
                    invited={invitedIds.has(match.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

