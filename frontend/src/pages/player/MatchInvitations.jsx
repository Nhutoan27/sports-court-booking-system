import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, Mail, MailOpen } from 'lucide-react';
import InvitationCard from './components/InvitationCard';
import SegmentedControl from '../../components/common/SegmentedControl';
import { matchingApi } from '../../services/api/matchingApi';

const matchingTips = [
  'Phản hồi lời mời sớm để không bỏ lỡ người chơi phù hợp.',
  'Cập nhật đầy đủ trình độ và khung giờ rảnh trong Hồ sơ để AI ghép cặp chính xác hơn.',
];

function toCardShape(invitation) {
  return {
    id: invitation.id,
    name: invitation.senderName,
    avatarUrl: invitation.senderAvatarUrl,
    tag: `${Math.round(invitation.similarityScore * 100)}% phù hợp`,
    sport: invitation.sportName,
    status: invitation.status,
  };
}

const EMPTY_LABEL = {
  PENDING: 'Chưa có lời mời nào đang chờ.',
  ACCEPTED: 'Chưa có lời mời nào bạn đã chấp nhận.',
  REJECTED: 'Chưa có lời mời nào bạn đã từ chối.',
};

export default function MatchInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('PENDING');

  const load = () => {
    setLoading(true);
    matchingApi
      .listReceivedInvitations({ size: 50 })
      .then((page) => setInvitations(page.content))
      .catch(() => setError('Không tải được danh sách lời mời.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const respond = async (invitation, accept) => {
    try {
      await (accept ? matchingApi.acceptInvitation(invitation.id) : matchingApi.rejectInvitation(invitation.id));
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Xử lý lời mời thất bại, vui lòng thử lại.');
    }
  };

  const byStatus = useMemo(() => {
    const grouped = { PENDING: [], ACCEPTED: [], REJECTED: [] };
    invitations.forEach((inv, idx) => {

      (grouped[inv.status] ?? grouped.PENDING).push({ card: toCardShape(inv), invitation: inv, idx });
    });
    return grouped;
  }, [invitations]);

  const tabOptions = [
    { value: 'PENDING', label: `Đang chờ (${byStatus.PENDING.length})` },
    { value: 'ACCEPTED', label: `Đã chấp nhận (${byStatus.ACCEPTED.length})` },
    { value: 'REJECTED', label: `Đã từ chối (${byStatus.REJECTED.length})` },
  ];
  const visible = byStatus[tab] ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
              <Mail className="size-5" />
            </span>
            Lời mời ghép cặp
          </h1>
          <p className="mt-2 text-ink-muted">Xem lại lời mời chơi cùng từ những người chơi khác.</p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-primary-container bg-primary-container/30 px-4 py-3 text-sm text-primary-on-container">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>{matchingTips.join(' ')}</p>
      </div>

      <SegmentedControl options={tabOptions} value={tab} onChange={setTab} className="mt-6 w-full sm:w-fit" />

      <div key={tab} className="mt-5 animate-fade-in space-y-4">
        {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        {!loading && !error && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-variant-2/40 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-container text-primary">
              <MailOpen className="size-6" />
            </span>
            <p className="text-sm text-ink-muted">{EMPTY_LABEL[tab]}</p>
          </div>
        )}

        {visible.map(({ card, invitation }) => (
          <InvitationCard
            key={card.id}
            invitation={card}
            onAccept={() => respond(invitation, true)}
            onDecline={() => respond(invitation, false)}
          />
        ))}
      </div>
    </div>
  );
}

