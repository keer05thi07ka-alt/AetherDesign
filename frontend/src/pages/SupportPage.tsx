import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import * as support from '../services/support.service';
import type { TicketTopic } from '../services/support.service';
import { SUPPORT } from '../config/support';

const TOPICS: Array<{ value: TicketTopic; label: string }> = [
  { value: 'generation', label: 'Image generation' },
  { value: 'editing', label: 'Editing and export' },
  { value: 'campaigns', label: 'Campaigns and approvals' },
  { value: 'account', label: 'Account and access' },
  { value: 'billing', label: 'Plans and billing' },
  { value: 'publishing', label: 'Scheduling and publishing' },
  { value: 'other', label: 'Something else' },
];

const FAQ = [
  {
    q: 'Why do my generated images have no text on them?',
    a: 'Image models render lettering unreliably, so we deliberately generate the visual only. Typography is added afterwards, which also means a single image can carry copy in several languages.',
  },
  {
    q: 'Why did generation ignore one of my brand rules?',
    a: 'Retrieval reports how confident it is. When nothing in your guidelines closely matches a request, generation uses your palette and tone but no specific rules — the AI Understanding panel shows which rules were found. Adding that rule to your guidelines usually fixes it.',
  },
  {
    q: 'Why do story-format images look softer than square ones?',
    a: 'The model generates at roughly one megapixel. Square formats need little scaling, but 9:16 story images are upscaled around 1.9 times to reach 1080 by 1920, which softens fine detail.',
  },
  {
    q: 'Can I upload a reference image?',
    a: 'Not yet. Both image-to-image providers we evaluated were unavailable — one returns a format we cannot process, the other requires a paid tier. It remains on the roadmap.',
  },
];

export const SupportPage: React.FC = () => {
  const { authState, user } = useApp();
  const signedIn = authState === 'ready';

  const [email, setEmail] = useState(signedIn ? user.email : '');
  const [name, setName] = useState(signedIn ? user.name : '');
  const [topic, setTopic] = useState<TicketTopic>('generation');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.error('Email and message are required');
      return;
    }
    setBusy(true);
    try {
      await support.submitTicket({
        email, name, topic,
        subject: subject.trim() || 'Support request',
        message,
      });
      setSent(true);
      setSubject('');
      setMessage('');
      toast.success(`Thanks. We reply ${SUPPORT.responseTime}.`);
    } catch {
      toast.error(`Could not send. Please email ${SUPPORT.email} instead.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Support</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Check the common questions below, or send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { icon: Mail, label: 'Email', value: SUPPORT.email, href: `mailto:${SUPPORT.email}` },
          { icon: Phone, label: 'Phone', value: SUPPORT.phone, href: `tel:${SUPPORT.phone.replace(/\s/g, '')}` },
          { icon: Clock, label: 'Hours', value: SUPPORT.hours, href: null },
        ].map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="bg-white p-5 rounded-3xl border border-[#E9D5FF] h-full">
              <Icon className="w-4 h-4 text-[#8B5CF6] mb-2" />
              <p className="text-[11px] font-semibold text-[#6B7280]">{c.label}</p>
              <p className="text-xs font-bold text-[#2D1B69] mt-0.5">{c.value}</p>
            </div>
          );
          return c.href
            ? <a key={c.label} href={c.href} className="block hover:opacity-80">{inner}</a>
            : <div key={c.label}>{inner}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF]">
          <h2 className="text-sm font-bold text-[#2D1B69] mb-4">Common questions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-[#F3F0FF] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#F8F7FF]"
                >
                  <span className="text-[11px] font-semibold text-[#2D1B69] pr-3">{item.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#8B5CF6] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i ? (
                  <p className="px-4 pb-3 text-[11px] text-[#4B5563] leading-relaxed">{item.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF]">
          <h2 className="text-sm font-bold text-[#2D1B69] mb-4">Send us a message</h2>

          {sent ? (
            <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-[11px] leading-relaxed">
              Your message is with our team. We reply {SUPPORT.responseTime}.
              <button
                onClick={() => setSent(false)}
                className="block mt-2 text-[#8B5CF6] font-semibold hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as TicketTopic)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69]"
                >
                  {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what happened, and what you expected instead."
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] text-[#2D1B69] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{busy ? 'Sending…' : 'Send message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};