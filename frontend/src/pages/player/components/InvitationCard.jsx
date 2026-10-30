import { Calendar, MapPin } from 'lucide-react';
import Avatar from '../../../components/common/Avatar';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

const STATUS_LABEL = { ACCEPTED: 'Đã chấp nhận', REJECTED: 'Đã từ chối' };

export default function InvitationCard({ invitation, onAccept, onDecline }) {
  const pending = invitation.status === 'PENDING';

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-soft">
      <Avatar src={invitation.avatarUrl} name={invitation.name} size="lg" />

      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-semibold text-ink">{invitation.name}</h3>
          <Badge color="primary" variant="soft">
            {invitation.tag}
          </Badge>
        </div>
        <p className="text-sm text-ink-muted">
          Mời bạn chơi cùng <span className="font-semibold text-ink">{invitation.sport}</span>
        </p>
        {(invitation.schedule || invitation.location) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
            {invitation.schedule && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {invitation.schedule}
              </span>
            )}
            {invitation.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {invitation.location}
              </span>
            )}
          </div>
        )}
      </div>

      {pending ? (
        <div className="flex flex-col gap-2">
          <Button variant="primary" rounded="full" size="sm" onClick={() => onAccept?.(invitation)}>
            Chấp nhận
          </Button>
          <Button variant="outline" rounded="full" size="sm" onClick={() => onDecline?.(invitation)}>
            Từ chối
          </Button>
        </div>
      ) : (
        <Badge color={invitation.status === 'ACCEPTED' ? 'success' : 'neutral'} variant="soft">
          {STATUS_LABEL[invitation.status] ?? invitation.status}
        </Badge>
      )}
    </div>
  );
}

