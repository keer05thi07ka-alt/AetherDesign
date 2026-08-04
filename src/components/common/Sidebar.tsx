import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Megaphone,
  Palette,
  CheckCircle2,
  BarChart3,
  Settings,
  Sparkles,
  Grid,
  FolderKanban,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { role, approvals } = useApp();
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const businessNav: NavItem[] = [
    { label: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'Campaigns', path: '/business/campaigns', icon: Megaphone },
    { label: 'Brand Kit', path: '/business/brand-kit', icon: Palette },
    {
      label: 'Approvals',
      path: '/business/approvals',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount.toString() : undefined,
    },
    { label: 'Analytics', path: '/business/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const creatorNav: NavItem[] = [
    { label: 'Dashboard', path: '/creator/dashboard', icon: LayoutDashboard },
    { label: 'AI Generator', path: '/creator/generator', icon: Sparkles, highlight: true },
    { label: 'Templates', path: '/creator/templates', icon: Grid },
    { label: 'Asset Library', path: '/creator/assets', icon: FolderKanban },
    { label: 'Canva Editor', path: '/creator/editor', icon: Edit3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = role === 'business' ? businessNav : creatorNav;

  return (
    <aside className="w-64 bg-white border-r border-[#E9D5FF] hidden md:flex flex-col justify-between p-4 sticky top-20 h-[calc(100vh-5rem)]">
      <div>
        
        {/* Workspace Tag */}
        <div className="mb-6 px-3 py-2.5 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-xs font-semibold text-[#2D1B69] capitalize">
              {role} Workspace
            </span>
          </div>
          <span className="text-[10px] bg-[#E9D5FF] text-[#2D1B69] font-bold px-2 py-0.5 rounded-md">
            PRO
          </span>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider text-[#6B7280] uppercase mb-2">
            Menu Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/20'
                      : 'text-[#2D1B69] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3 z-10">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : item.highlight ? 'text-[#8B5CF6]' : 'text-[#6B7280] group-hover:text-[#8B5CF6]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold z-10 ${
                          isActive
                            ? 'bg-white text-[#8B5CF6]'
                            : 'bg-[#F3F0FF] text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-[#8B5CF6] rounded-2xl -z-0"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Widget */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#F3F0FF] to-[#EDE9FE] border border-[#E9D5FF] text-left">
        <div className="flex items-center space-x-2 text-[#8B5CF6] mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold">Aether Creative OS</span>
        </div>
        <p className="text-[11px] text-[#6B7280] leading-snug">
          Enterprise AI Content Generation & Governance Platform
        </p>
      </div>
    </aside>
  );
};
