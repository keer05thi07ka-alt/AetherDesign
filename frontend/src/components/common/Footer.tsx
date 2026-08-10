import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe, Share2, MessageSquare, Send, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F3F0FF] border-t border-[#E9D5FF] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#7C3AED] rounded-3xl p-8 sm:p-12 mb-16 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-flex items-center space-x-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stay Ahead of Creative AI</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Join 50,000+ Designers & Brands
              </h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                Get weekly prompt guides, AI template releases, and brand automation tips delivered straight to your inbox.
              </p>
            </div>

            <div className="flex items-center">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to AetherDesign AI updates!');
                }}
                className="w-full flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-white text-[#8B5CF6] font-semibold text-sm hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#E9D5FF]">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#C4B5FD] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#2D1B69]">
                AetherDesign <span className="text-[#8B5CF6]">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
              Transforming Ideas into Stunning Visual Experiences with AI. Simplify logo generation, marketing collateral, social stories, and enterprise campaign management with guaranteed brand consistency.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center text-[#2D1B69] hover:bg-[#8B5CF6] hover:text-white transition-colors" title="Global Web">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center text-[#2D1B69] hover:bg-[#8B5CF6] hover:text-white transition-colors" title="Community">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center text-[#2D1B69] hover:bg-[#8B5CF6] hover:text-white transition-colors" title="Newsletter">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white border border-[#E9D5FF] flex items-center justify-center text-[#2D1B69] hover:bg-[#8B5CF6] hover:text-white transition-colors" title="Share Platform">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-semibold text-sm text-[#2D1B69] mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link to="/creator/generator" className="hover:text-[#8B5CF6] transition-colors">AI Generator</Link></li>
              <li><Link to="/business/brand-kit" className="hover:text-[#8B5CF6] transition-colors">Brand Kit Engine</Link></li>
              <li><Link to="/creator/templates" className="hover:text-[#8B5CF6] transition-colors">Template Library</Link></li>
              <li><Link to="/creator/editor" className="hover:text-[#8B5CF6] transition-colors">Design Studio</Link></li>
              <li><Link to="/business/campaigns" className="hover:text-[#8B5CF6] transition-colors">Campaign Workflows</Link></li>
              <li><Link to="/business/analytics" className="hover:text-[#8B5CF6] transition-colors">Creative Analytics</Link></li>
            </ul>
          </div>

          {/* Column 3: Workspaces */}
          <div>
            <h4 className="font-semibold text-sm text-[#2D1B69] mb-4 uppercase tracking-wider">Workspaces</h4>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><Link to="/business/dashboard" className="hover:text-[#8B5CF6] transition-colors">Business Workspace</Link></li>
              <li><Link to="/creator/dashboard" className="hover:text-[#8B5CF6] transition-colors">Creator Workspace</Link></li>
              <li><Link to="/role-selection" className="hover:text-[#8B5CF6] transition-colors">Role Portal</Link></li>
              <li><Link to="/business/approvals" className="hover:text-[#8B5CF6] transition-colors">Design Approval Queue</Link></li>
              <li><Link to="/creator/assets" className="hover:text-[#8B5CF6] transition-colors">Asset Vault</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-semibold text-sm text-[#2D1B69] mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm text-[#6B7280]">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Careers</a> <span className="bg-[#8B5CF6] text-white text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">Hiring</span></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Terms of Service</a></li>
              <li><Link to="/support" className="hover:text-[#8B5CF6] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280]">
          <p>© 2026 AetherDesign AI Platform Inc. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#8B5CF6] fill-current" />
            <span>for global brands & high-velocity creators.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
