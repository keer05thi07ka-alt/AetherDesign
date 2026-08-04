import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Save, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'theme'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title || 'Creative Director');
  const [company, setCompany] = useState(user.company || 'Nexus Innovations');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      title,
      company,
    });
    toast.success('Settings updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme & Brand', icon: Palette },
  ] as const;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Account & System Settings</h1>
        <p className="text-xs text-[#6B7280]">
          Manage your personal profile, security credentials, and workspace theme.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Settings Tabs */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-[#E9D5FF] shadow-lavender-sm space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/20'
                    : 'text-[#2D1B69] hover:bg-[#F3F0FF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right 8 Cols: Tab Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-lavender-sm min-h-[420px]">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h3 className="text-lg font-bold text-[#2D1B69] mb-4">Profile Information</h3>

              <div className="flex items-center space-x-4 pb-4 border-b border-[#F3F0FF]">
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C4B5FD]" />
                <div>
                  <button type="button" onClick={() => alert('Simulated avatar change')} className="px-4 py-2 bg-[#F3F0FF] text-[#8B5CF6] font-bold text-xs rounded-xl hover:bg-purple-100">
                    Change Avatar
                  </button>
                  <p className="text-[10px] text-[#6B7280] mt-1">JPG or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Role Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3F0FF]">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2D1B69]">Security & Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">New Password</label>
                  <input type="password" placeholder="Minimum 8 characters" className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs" />
                </div>
              </div>
              <button onClick={() => toast.success('Password updated successfully!')} className="px-6 py-2.5 bg-[#8B5CF6] text-white font-bold text-xs rounded-2xl">
                Update Password
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2D1B69]">Notification Preferences</h3>
              <div className="space-y-3 text-xs text-[#2D1B69]">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8B5CF6]" />
                  <span>Email alert when a creator submits a design for approval</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8B5CF6]" />
                  <span>Notification when new campaign assets are published</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2D1B69]">Theme & Branding</h3>
              <div className="p-4 rounded-2xl bg-[#F3F0FF] border border-[#E9D5FF] space-y-2">
                <div className="flex items-center space-x-2 text-[#8B5CF6] font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Light + Lavender Palette Active</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  This application strictly enforces the soft Light + Lavender aesthetic for maximum readability and modern SaaS feel.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
