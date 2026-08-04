import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset link sent to your email!');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9D5FF] shadow-xl p-8 sm:p-10 text-left">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-[#2D1B69]">AetherDesign AI</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#2D1B69]">Reset Password</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Enter your account email address and we'll send you a password recovery link.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1B69] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 bg-[#F8F7FF] border border-[#E9D5FF] p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2D1B69]">Check your email inbox</h4>
            <p className="text-xs text-[#6B7280]">
              We sent password reset instructions to <span className="font-semibold text-[#2D1B69]">{email}</span>.
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-[#F3F0FF] text-center text-xs text-[#6B7280] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-[#8B5CF6] font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};
