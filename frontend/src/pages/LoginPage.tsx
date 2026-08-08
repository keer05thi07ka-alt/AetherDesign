import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, Briefcase, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, signInWithGoogle, loading } = useApp();

  const isCreatorRoute = location.pathname.includes('creator') || location.search.includes('role=creator');
  const [activeRole, setActiveRole] = useState<'business' | 'creator'>(isCreatorRoute ? 'creator' : 'business');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isCreatorRoute) {
      setActiveRole('creator');
    } else {
      setActiveRole('business');
    }
  }, [location.pathname, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signInWithPassword(email, password);
    if (!result.ok) return;

    // Signed up but never finished onboarding.
    if (result.needsOnboarding) {
      navigate('/onboarding');
      return;
    }

    // Route by the role the backend returned, not the tab clicked.
    navigate(result.workspace === 'business' ? '/business/dashboard' : '/creator/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#E9D5FF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
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

            {/* Separate Role Auth Selector Pills */}
            <div className="bg-[#F8F7FF] border border-[#E9D5FF] p-1.5 rounded-2xl flex items-center mb-6">
              <button
                type="button"
                onClick={() => setActiveRole('business')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'business'
                    ? 'bg-[#8B5CF6] text-white shadow-md'
                    : 'text-[#6B7280] hover:text-[#2D1B69]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Business Login</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole('creator')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'creator'
                    ? 'bg-[#8B5CF6] text-white shadow-md'
                    : 'text-[#6B7280] hover:text-[#2D1B69]'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Creator Login</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B69] tracking-tight">
              {activeRole === 'business' ? 'Business Workspace Login' : 'Creator Workspace Login'}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1.5 mb-6">
              {activeRole === 'business'
                ? 'Sign in to manage brand kits, campaign governance, and approval workflows.'
                : 'Sign in to access AI visual generation, template engines, and Canva-style editor.'}
            </p>

            <button
                type="button"
                onClick={() => signInWithGoogle('login')}
                disabled={loading}
                className="w-full py-3 mb-4 border border-[#E9D5FF] rounded-2xl flex items-center justify-center space-x-2 hover:bg-[#F8F7FF] transition-all disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs font-semibold text-[#2D1B69]">Continue with Google</span>
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 h-px bg-[#F3F0FF]" />
                <span className="text-[10px] text-[#9CA3AF] font-medium">or</span>
                <div className="flex-1 h-px bg-[#F3F0FF]" />
              </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-1">
                  {activeRole === 'business' ? 'Business Work Email' : 'Creator Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#2D1B69]">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#8B5CF6] font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Signing in…</span>
                ) : (
                  <>
                    <span>Enter {activeRole === 'business' ? 'Business' : 'Creator'} Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-[#F3F0FF] text-center text-xs text-[#6B7280]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#8B5CF6] font-bold hover:underline">
              Create free account
            </Link>
          </div>

        </div>

        {/* Right Split Illustration Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#8B5CF6] via-[#9333EA] to-[#6D28D9] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex text-left">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
              {activeRole === 'business' ? 'Business Governance' : 'Creator Studio'}
            </span>
            <h3 className="text-2xl font-bold leading-snug">
              {activeRole === 'business'
                ? 'Empower Brands with Automated Visual Consistency.'
                : 'Turn Prompts into Stunning Visual Artwork.'}
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed">
              {activeRole === 'business'
                ? 'Directly access campaign managers, brand kit rule builders, creator deliverables, and approval queues.'
                : 'Directly access AI generator engines, Canva-style visual canvas, and responsive template libraries.'}
            </p>
          </div>

          <div className="relative z-10 my-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{activeRole === 'business' ? 'Direct Business Dashboard Access' : 'Direct Creator Studio Access'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Strict Role Governance & Permissions</span>
            </div>
          </div>

          <p className="text-[11px] text-purple-200">© 2026 AetherDesign AI. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};
