import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bell, User as UserIcon, LogOut, ChevronDown, Briefcase, Palette, ArrowRight, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SwitchWorkspaceModal } from './SwitchWorkspaceModal';
import type { WorkspaceRole } from '../../types';

export const Navbar: React.FC = () => {
  const { role, user, businessSession, creatorSession, loginAsRole, notifications, markNotificationRead, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Switch workspace confirmation modal state
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [targetSwitchRole, setTargetSwitchRole] = useState<WorkspaceRole>('creator');

  const isWorkspaceRoute = location.pathname.startsWith('/business') || location.pathname.startsWith('/creator') || location.pathname === '/settings';
  const unreadCount = notifications.filter((n) => n.unread).length;

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSwitchWorkspaceClick = () => {
    setShowUserMenu(false);
    const destRole: WorkspaceRole = role === 'business' ? 'creator' : 'business';
    setTargetSwitchRole(destRole);

    const activeDestSession = destRole === 'business' ? businessSession : creatorSession;
    if (activeDestSession) {
      loginAsRole(destRole);
      navigate(destRole === 'business' ? '/business/dashboard' : '/creator/dashboard');
    } else {
      setShowSwitchModal(true);
    }
  };

  const handleConfirmSwitchModal = () => {
    setShowSwitchModal(false);
    navigate(`/login/${targetSwitchRole}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xl tracking-tight text-[#2D1B69]">AetherDesign</span>
                  <span className="bg-[#8B5CF6] text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
                </div>
                <p className="text-[10px] text-[#6B7280] font-medium tracking-wide">CREATIVE OS</p>
              </div>
            </Link>

            {/* Public Nav Links (Non-workspace view) */}
            {!isWorkspaceRoute && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-medium text-[#2D1B69] hover:text-[#8B5CF6] transition-colors">Home</Link>
                <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-[#6B7280] hover:text-[#8B5CF6] transition-colors">Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-[#6B7280] hover:text-[#8B5CF6] transition-colors">Solutions</button>
                <button onClick={() => scrollToSection('faq')} className="text-sm font-medium text-[#6B7280] hover:text-[#8B5CF6] transition-colors">FAQ</button>
              </nav>
            )}

            {/* Single Current Workspace Badge in Top Bar */}
            {isWorkspaceRoute && (
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#F3F0FF] border border-[#E9D5FF]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                {role === 'business' ? (
                  <span className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Business Workspace
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Creator Workspace
                  </span>
                )}
              </div>
            )}

            {/* Right Action Items */}
            <div className="hidden md:flex items-center space-x-3">
              {!isWorkspaceRoute ? (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#2D1B69] hover:text-[#8B5CF6] px-4 py-2 rounded-xl hover:bg-[#F3F0FF] transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/role-selection"
                    className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2.5 rounded-2xl bg-white border border-[#E9D5FF] text-[#2D1B69] hover:bg-[#F3F0FF] transition-all"
                    >
                      <Bell className="w-5 h-5 text-[#8B5CF6]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl border border-[#E9D5FF] shadow-xl p-4 z-50"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-[#F3F0FF]">
                            <h4 className="font-semibold text-sm text-[#2D1B69]">Notifications</h4>
                            <span className="text-xs bg-[#F3F0FF] text-[#8B5CF6] font-medium px-2.5 py-0.5 rounded-full">
                              {unreadCount} unread
                            </span>
                          </div>
                          <div className="divide-y divide-[#F3F0FF] max-h-72 overflow-y-auto my-2">
                            {notifications.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => markNotificationRead(item.id)}
                                className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                                  item.unread ? 'bg-[#F8F7FF]' : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-medium text-xs text-[#2D1B69]">{item.title}</span>
                                  <span className="text-[10px] text-gray-400">{item.time}</span>
                                </div>
                                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.message}</p>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="w-full text-center text-xs text-[#8B5CF6] font-semibold pt-2 border-t border-[#F3F0FF] hover:underline"
                          >
                            Close Notifications
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-white border border-[#E9D5FF] hover:bg-[#F3F0FF] transition-all"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover border border-[#C4B5FD]"
                      />
                      <div className="text-left hidden lg:block">
                        <p className="text-xs font-semibold text-[#2D1B69]">{user.name}</p>
                        <p className="text-[10px] text-[#6B7280] capitalize">{user.role} Workspace</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-3xl border border-[#E9D5FF] shadow-xl p-2 z-50"
                        >
                          <div className="p-3 border-b border-[#F3F0FF]">
                            <p className="text-xs font-semibold text-[#2D1B69]">{user.name}</p>
                            <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            
                            {/* Switch Workspace trigger in Profile Menu */}
                            <button
                              onClick={handleSwitchWorkspaceClick}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-[#2D1B69] hover:bg-[#F3F0FF] rounded-xl transition-colors text-left"
                            >
                              <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
                              <span>Switch Workspace</span>
                            </button>

                            <Link
                              to="/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-[#2D1B69] hover:bg-[#F3F0FF] rounded-xl transition-colors"
                            >
                              <UserIcon className="w-4 h-4 text-[#8B5CF6]" />
                              <span>Account Settings</span>
                            </Link>
                          </div>
                          
                          <div className="pt-1 border-t border-[#F3F0FF]">
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                logout();
                                navigate('/login');
                              }}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Log Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#2D1B69] hover:bg-[#F3F0FF]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#E9D5FF] px-4 pt-2 pb-6 space-y-3"
          >
            {!isWorkspaceRoute ? (
              <>
                <Link to="/" className="block py-2 text-sm font-medium text-[#2D1B69]">Home</Link>
                <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium text-[#6B7280]">Features</button>
                <button onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium text-[#6B7280]">Solutions</button>
                <button onClick={() => { scrollToSection('faq'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium text-[#6B7280]">FAQ</button>
                <div className="pt-4 space-y-2 border-t border-[#F3F0FF]">
                  <Link to="/login" className="block text-center py-2.5 text-sm font-semibold text-[#2D1B69] bg-[#F8F7FF] rounded-xl border border-[#E9D5FF]">Log In</Link>
                  <Link to="/role-selection" className="block text-center py-2.5 text-sm font-semibold text-white bg-[#8B5CF6] rounded-xl shadow-md">Get Started</Link>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Workspace Management</p>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSwitchWorkspaceClick(); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold bg-[#F3F0FF] text-[#2D1B69]"
                >
                  <span>Switch Workspace</span>
                  <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </header>

      {/* Confirmation Modal */}
      <SwitchWorkspaceModal
        isOpen={showSwitchModal}
        targetRole={targetSwitchRole}
        onClose={() => setShowSwitchModal(false)}
        onConfirm={handleConfirmSwitchModal}
      />
    </>
  );
};
