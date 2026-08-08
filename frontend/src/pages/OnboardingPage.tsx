import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User as UserIcon, Users, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const PLANS = [
  {
    id: 'free' as const,
    icon: UserIcon,
    title: 'Just me',
    subtitle: 'Solo creator',
    features: ['AI image generation', 'Template library', 'Scheduling', 'One brand kit'],
  },
  {
    id: 'enterprise' as const,
    icon: Users,
    title: 'My team',
    subtitle: 'Business or agency',
    features: ['Everything in Just me', 'Brand kits with AI recall', 'Roles and approvals', 'Unlimited members'],
  },
];

/**
 * Consumer mailbox providers. A custom domain usually signals a business.
 * Used only to pre-select a plan — never to enforce one, since plenty of
 * small businesses run on Gmail.
 */
const CONSUMER_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'outlook.com',
  'hotmail.com', 'live.com', 'icloud.com', 'me.com', 'proton.me',
  'protonmail.com', 'aol.com', 'rediffmail.com', 'zoho.com',
]);

function looksLikeBusiness(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return domain !== '' && !CONSUMER_DOMAINS.has(domain);
}

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user, loading } = useApp();

  const [plan, setPlan] = useState<'free' | 'enterprise'>(
    looksLikeBusiness(user.email) ? 'enterprise' : 'free',
  );
  const [name, setName] = useState('');

  const suggested = user.name ? `${user.name.split(' ')[0]}'s Workspace` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || suggested;
    if (!finalName) {
      toast.error('Give your workspace a name');
      return;
    }
    const workspace = await completeOnboarding(finalName, plan);
    if (!workspace) return;
    navigate(workspace === 'business' ? '/business/dashboard' : '/creator/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E9D5FF] shadow-xl p-10">
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2D1B69]">
              Welcome{user.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-xs text-[#6B7280]">How will you use AetherDesign?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PLANS.map((option) => {
              const Icon = option.icon;
              const selected = plan === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPlan(option.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    selected
                      ? 'border-[#8B5CF6] bg-[#F8F7FF] shadow-md'
                      : 'border-[#E9D5FF] hover:border-[#C4B5FD]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-[#8B5CF6]" />
                    {selected && <Check className="w-4 h-4 text-[#8B5CF6]" />}
                  </div>
                  <h3 className="text-sm font-bold text-[#2D1B69]">{option.title}</h3>
                  <p className="text-[11px] text-[#6B7280] mb-3">{option.subtitle}</p>
                  <ul className="space-y-1">
                    {option.features.map((f) => (
                      <li key={f} className="text-[11px] text-[#4B5563] flex items-start">
                        <span className="text-[#8B5CF6] mr-1.5">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {looksLikeBusiness(user.email) && (
            <p className="text-[11px] text-[#6B7280] mb-4">
              We noticed a company email address, so we've suggested the team
              workspace. You can change this.
            </p>
          )}

          <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Workspace name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={suggested || 'Acme Studio'}
            className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-sm text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <span>{loading ? 'Creating workspace…' : 'Get started'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};