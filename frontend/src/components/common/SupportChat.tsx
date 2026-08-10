import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2, LifeBuoy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import * as support from '../../services/support.service';
import type { ChatMessage } from '../../services/support.service';
import { SUPPORT } from '../../config/support';

const SUGGESTIONS = [
  'Why does my image have no text on it?',
  'How do I add my brand colours?',
  'Why did generation ignore my guidelines?',
];

export const SupportChat: React.FC = () => {
  const { authState, plan, membershipRole, user } = useApp();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  // Only offer support to signed-in users — the assistant's answers depend
  // on knowing their plan and role.
  if (authState !== 'ready') return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next: ChatMessage[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(next);
    setDraft('');
    setBusy(true);

    try {
      const reply = await support.askSupport(next, {
        plan: plan ?? 'free',
        role: membershipRole ?? 'designer',
        page: location.pathname,
      });
      setMessages([...next, { role: 'assistant', text: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Support is unavailable');
      setMessages(next);
    } finally {
      setBusy(false);
    }
  };

  const escalate = async () => {
    if (messages.length === 0) {
      toast.error('Ask a question first, then we can pass it to the team');
      return;
    }
    const firstQuestion = messages.find((m) => m.role === 'user')?.text ?? 'Support request';
    try {
      await support.submitTicket({
        email: user.email,
        name: user.name,
        topic: 'other',
        subject: firstQuestion.slice(0, 80),
        message: 'Escalated from the in-app assistant. Full conversation attached.',
        transcript: messages,
      });
      toast.success(`Sent to our team. We reply ${SUPPORT.responseTime}.`);
    } catch {
      toast.error('Could not reach support. Please email us instead.');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-500/30 flex items-center space-x-2 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Need Help?</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-3rem)] bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl flex flex-col overflow-hidden">
      <div className="px-5 py-4 bg-[#8B5CF6] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <LifeBuoy className="w-4 h-4" />
          <div>
            <p className="text-xs font-bold">AetherDesign Support</p>
            <p className="text-[10px] opacity-80">Ask about generation, brand kits, or your account</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Hello {user.name.split(' ')[0]}. Ask me anything about the platform,
              or start with one of these.
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left px-3 py-2.5 rounded-xl border border-[#E9D5FF] text-[11px] text-[#2D1B69] hover:bg-[#F8F7FF] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={
                  m.role === 'user'
                    ? 'max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[#8B5CF6] text-white text-[11px] leading-relaxed'
                    : 'max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-[#F3F0FF] text-[#2D1B69] text-[11px] leading-relaxed whitespace-pre-wrap'
                }
              >
                {m.text}
              </div>
            </div>
          ))
        )}

        {busy ? (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#F3F0FF] flex items-center space-x-2">
              <Loader2 className="w-3 h-3 animate-spin text-[#8B5CF6]" />
              <span className="text-[11px] text-[#6B7280]">Thinking…</span>
            </div>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {messages.length > 0 ? (
        <div className="px-4 pb-2 shrink-0">
          <button
            onClick={escalate}
            className="text-[10px] text-[#8B5CF6] font-semibold hover:underline"
          >
            Not solved? Send this conversation to our team
          </button>
        </div>
      ) : null}

      <div className="p-3 border-t border-[#F3F0FF] flex items-center space-x-2 shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(draft); }}
          placeholder="Ask a question…"
          disabled={busy}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-60"
        />
        <button
          onClick={() => send(draft)}
          disabled={busy || !draft.trim()}
          className="p-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};