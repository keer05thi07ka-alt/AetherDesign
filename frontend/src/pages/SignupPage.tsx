import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithPassword, signInWithGoogle, loading } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    const result = await signUpWithPassword(email, password, fullName);
    if (!result.ok) return;

    // An email may already map to an existing membership (a seeded or
    // previously invited user). Only send genuinely new users to onboarding.
    if (result.needsOnboarding) {
      navigate('/onboarding');
      return;
    }

    navigate(result.workspace === 'business' ? '/business/dashboard' : '/creator/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#E9D5FF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between text-left">
          
          <div>
            {/* Header Logo */}
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-[#2D1B69]">AetherDesign AI</span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B69] tracking-tight">
              Create your account
            </h2>
            <p className="text-xs text-[#6B7280] mt-1 mb-6">
              Start generating AI content and managing brand campaigns in minutes.
            </p>

            <button
              type="button"
              onClick={() => signInWithGoogle('signup')}
              disabled={loading}
              className="w-full py-3 mb-4 border border-[#E9D5FF] rounded-2xl flex items-center justify-center space-x-2 hover:bg-[#F8F7FF] transition-all disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-semibold text-[#2D1B69]">Sign up with Google</span>
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 h-px bg-[#F3F0FF]" />
              <span className="text-[10px] text-[#9CA3AF] font-medium">or</span>
              <div className="flex-1 h-px bg-[#F3F0FF]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Alex Rivera"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="alex@nexus.ai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Creating account…</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#F3F0FF] text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8B5CF6] font-bold hover:underline">
              Log in
            </Link>
          </div>

        </div>

        {/* Right Split Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#8B5CF6] via-[#9333EA] to-[#6D28D9] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex text-left">
          <div className="relative z-10 space-y-4">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
              14-Day Free Trial
            </span>
            <h3 className="text-2xl font-bold leading-snug">
              Unlock Unlimited AI Generation & Brand Kit Automation.
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed">
              No credit card required. Instant access to both Business & Creator Workspaces.
            </p>
          </div>

          <div className="relative z-10 space-y-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Multi-step campaign wizards</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Full Canva-style visual canvas</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-[#34A853]" />
              <span>Real-time design approvals & feedback</span>
            </div>
          </div>

          <p className="text-[11px] text-purple-200">© 2026 AetherDesign AI Inc.</p>
        </div>

      </div>
    </div>
  );
};
