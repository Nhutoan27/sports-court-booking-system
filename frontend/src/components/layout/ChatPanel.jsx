import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import ChatBubble from '../../pages/player/components/ChatBubble';
import { chatApi } from '../../services/api/chatApi';

const QUICK_REPLIES = ['Chính sách đặt cọc?', 'Chính sách hủy sân?', 'Giờ hoạt động?', 'Tìm người chơi cùng'];

const SESSION_STORAGE_KEY = 'chatSessionId';

const SESSION_TOKEN_STORAGE_KEY = 'chatSessionToken';

function toBubble(message) {
  return {
    id: message.id,
    from: message.sender === 'BOT' ? 'bot' : 'user',
    text: message.content,
    sourceReference: message.sourceReference,
  };
}

export default function ChatPanel() {
  const [sessionId, setSessionId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const cachedId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const cachedToken = sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    const init = cachedId
      ? chatApi
          .listMessages(cachedId, cachedToken)
          .then((page) => ({ id: Number(cachedId), token: cachedToken, messages: page.content }))
      : chatApi.createSession().then((session) => ({ id: session.id, token: session.sessionToken, messages: [] }));

    init
      .then(({ id, token, messages: msgs }) => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, id);
        if (token) sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
        setSessionId(id);
        setSessionToken(token);
        setMessages(msgs.map(toBubble));
      })
      .catch(() => {

        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
        chatApi.createSession().then((session) => {
          sessionStorage.setItem(SESSION_STORAGE_KEY, session.id);
          sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, session.sessionToken);
          setSessionId(session.id);
          setSessionToken(session.sessionToken);
        });
      });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (content) => {
    const text = content.trim();
    if (!text || !sessionId || sending) return;

    setError('');
    setSending(true);
    setDraft('');
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, from: 'user', text }]);

    try {
      const reply = await chatApi.sendMessage(sessionId, sessionToken, text);
      setMessages((prev) => [...prev, toBubble(reply)]);
    } catch {
      setError('Chatbot đang gặp sự cố (có thể do máy chủ AI chưa sẵn sàng), vui lòng thử lại sau.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-ink-muted">
            Xin chào! Hỏi tôi về chính sách đặt sân, thanh toán, hoặc tìm người chơi cùng.
          </p>
        )}
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {sending && <p className="text-xs text-ink-soft">Đang trả lời...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="border-t border-outline-variant bg-white px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => send(reply)}
              className="rounded-full bg-surface-variant-2 px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-primary-container hover:text-primary-on-container"
            >
              {reply}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2 rounded-full border border-outline bg-white px-2 py-1.5 transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nhập câu hỏi..."
            className="flex-1 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
          />
          <button
            type="submit"
            aria-label="Gửi"
            disabled={sending || !draft.trim()}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

