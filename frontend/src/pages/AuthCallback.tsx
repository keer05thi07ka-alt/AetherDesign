import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { signOut } from '../services/resources.service';

/**
 * Landing point for the Google OAuth redirect.
 *
 * Supabase parses the session out of the URL fragment, after which we
 * exchange it for an AetherDesign session token and route onward.
 */
export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { completeAuth } = useApp();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;   // React 18 StrictMode double-invokes effects
    ran.current = true;

    const intent = params.get('intent') ?? 'login';

    void (async () => {
      const result = await completeAuth();

      if (!result.ok) {
        toast.error('Sign-in failed. Please try again.');
        navigate('/login');
        return;
      }

      if (result.needsOnboarding) {
        // Strict separation: a Google user with no account must sign up first.
        if (intent === 'login') {
          await signOut();
          toast.error('No account found. Please sign up first.');
          navigate('/signup');
          return;
        }
        navigate('/onboarding');
        return;
      }

      navigate(result.workspace === 'business' ? '/business/dashboard' : '/creator/dashboard');
    })();
  }, [completeAuth, navigate, params]);

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-md animate-pulse mb-4">
        <Sparkles className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-[#2D1B69]">Signing you in…</p>
    </div>
  );
};