import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở trợ lý chat"
        className="fixed bottom-6 right-6 z-40 inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-primary-lg transition-transform hover:scale-105 hover:bg-primary-hover active:scale-95"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
        <Bot className="size-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-primary-lg animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-outline-variant bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold">Trợ lý NhuToan</p>
            <p className="flex items-center gap-1 text-xs text-white/80">
              <span className="size-1.5 rounded-full bg-accent" />
              Online
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Thu nhỏ"
          className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      <ChatPanel />
    </div>
  );
}

