/**
 * In-app support: chat assistant and ticket submission.
 *
 * The assistant is stateless on the backend — the frontend sends the recent
 * conversation each turn. That keeps the workflow simple and means a page
 * refresh cleanly starts a new session.
 */

import * as api from '../lib/apiClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatContext {
  plan?: string;
  role?: string;
  page?: string;
}

const BASE = import.meta.env.VITE_API_BASE_URL as string;

export async function askSupport(
  messages: ChatMessage[],
  context: ChatContext,
): Promise<string> {
  const token = api.getToken();

  const res = await fetch(`${BASE}/support/chat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });

  if (!res.ok) {
    throw new Error('Support is temporarily unavailable. Please try again.');
  }

  const body = await res.json();
  if (!body.reply) throw new Error('No reply received.');
  return body.reply as string;
}

export type TicketTopic =
  | 'generation' | 'editing' | 'campaigns'
  | 'account' | 'billing' | 'publishing' | 'other';

export interface TicketInput {
  email: string;
  name?: string;
  topic: TicketTopic;
  subject: string;
  message: string;
  transcript?: ChatMessage[];
}

export async function submitTicket(input: TicketInput): Promise<{ id: string }> {
  const result = await api.write('support_tickets' as never, 'create', {
    email: input.email,
    name: input.name ?? null,
    topic: input.topic,
    subject: input.subject,
    message: input.message,
    chat_transcript: input.transcript ?? null,
  } as never);
  return result as unknown as { id: string };
}

export interface SupportTicket {
  id: string;
  email: string;
  name: string | null;
  topic: TicketTopic;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  has_transcript: boolean;
}

export async function fetchTickets(): Promise<SupportTicket[]> {
  const rows = await api.list('support_tickets' as never);
  return rows as unknown as SupportTicket[];
}