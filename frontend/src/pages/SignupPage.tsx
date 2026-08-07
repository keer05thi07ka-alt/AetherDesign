import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useApp(); 

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgName.trim()) {
      toast.error('Organisation name is required');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    const workspace = await signUp({
      fullName,
      email,
      orgName,
      password,
    });
    if (!workspace) return;

    // A new signup is always the org owner, so the business workspace.
    navigate('/business/dashboard');
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
                <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    placeholder="Nexus Innovations"
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
