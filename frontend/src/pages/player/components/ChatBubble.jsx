import { Bot } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { cn } from '../../../utils/cn';

export default function ChatBubble({ message }) {
  if (message.type === 'divider') {
    return <p className="my-4 text-center text-xs text-ink-soft">{message.label}</p>;
  }

  const isBot = message.from === 'bot';

  return (
    <div className={cn('flex items-end gap-2', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <span className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Bot className="size-4" />
        </span>
      )}

      <div
        className={cn(
          'max-w-md rounded-2xl px-4 py-3 text-sm',
          isBot ? 'rounded-bl-sm bg-surface-variant-2 text-ink' : 'rounded-br-sm bg-secondary text-white'
        )}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {message.courtOptions && (
          <div className="mt-3 space-y-2">
            {message.courtOptions.map((court) => (
              <div key={court.id} className="rounded-lg border border-outline-variant bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{court.name}</span>
                  <Badge color="primary" variant="solid">
                    AVAILABLE
                  </Badge>
                </div>
                <p className="mb-2 text-xs text-ink-muted">{court.time}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-soft">{court.price}</span>
                  <Button variant="outline" size="sm" rounded="full">
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message.bullets && (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {message.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}

        {message.link && (
          <button type="button" className="mt-2 text-xs font-medium text-primary underline">
            {message.link}
          </button>
        )}

        {message.sourceReference && (
          <p className={cn('mt-2 text-xs italic', isBot ? 'text-ink-soft' : 'text-white/70')}>
            Nguồn: {message.sourceReference}
          </p>
        )}
      </div>
    </div>
  );
}

