import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Download,
  Wand2,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  X,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyticsData } from '../../data/mockData';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedAssets, brandKit } = useApp();
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const COLORS = ['#8B5CF6', '#C4B5FD', '#A78BFA', '#2D1B69', '#EDE9FE'];

  // Dynamic Compliance Calculation Engine based on Brand Kit setup & Workflow Governance
  const hasColors = Boolean(brandKit.primaryColor && brandKit.secondaryColor);
  const hasLogo = Boolean(brandKit.logoUrl);
  const hasTypography = Boolean(brandKit.typography && brandKit.tone);
  const hasGuidelines = Boolean(brandKit.guidelines && brandKit.guidelines.trim().length > 0);

  const colorsScore = hasColors ? 25 : 0;
  const logoScore = hasLogo ? 25 : 0;
  const typographyScore = hasTypography ? 25 : 0;
  const guidelinesScore = hasGuidelines ? 25 : 0;

  const totalComplianceScore = colorsScore + logoScore + typographyScore + guidelinesScore;

  const complianceItems = [
    {
      title: 'Brand Palette & Colors',
      desc: `Primary (${brandKit.primaryColor || 'Not set'}) & Secondary colors defined`,
      score: colorsScore,
      maxScore: 25,
      isMet: hasColors,
    },
    {
      title: 'Official Logo & Assets',
      desc: hasLogo ? 'High-res brand logo uploaded and locked' : 'No brand logo uploaded yet',
      score: logoScore,
      maxScore: 25,
      isMet: hasLogo,
    },
    {
      title: 'Typography & Tone Rules',
      desc: `Font (${brandKit.typography}) & Brand Voice (${brandKit.tone}) configured`,
      score: typographyScore,
      maxScore: 25,
      isMet: hasTypography,
    },
    {
      title: 'Governance Guidelines',
      desc: hasGuidelines ? 'Campaign brand rules & prompt restrictions active' : 'No brand rules specified',
      score: guidelinesScore,
      maxScore: 25,
      isMet: hasGuidelines,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Creative Performance Analytics</h1>
        <p className="text-xs text-[#6B7280]">
          Comprehensive analytics covering AI prompt generations, campaign velocity, asset downloads, and brand compliance.
        </p>
      </div>

      {/* Top 4 Key Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total AI Generations Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm">
          <div className="flex justify-between items-center text-xs text-[#6B7280] font-semibold">
            <span>Total AI Generations</span>
            <Wand2 className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2D1B69] mt-2">{generatedAssets.length}</p>
          <span className="text-[11px] font-bold text-[#8B5CF6] flex items-center gap-1 mt-1">
            0 vs last month
          </span>
        </div>

        {/* High-Res Downloads Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm">
          <div className="flex justify-between items-center text-xs text-[#6B7280] font-semibold">
            <span>High-Res Downloads</span>
            <Download className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2D1B69] mt-2">{generatedAssets.length}</p>
          <span className="text-[11px] font-bold text-[#8B5CF6] flex items-center gap-1 mt-1">
            0 exports
          </span>
        </div>

        {/* Interactive Brand Compliance Score Card */}
        <div
          onClick={() => setShowComplianceModal(true)}
          className="bg-white p-5 rounded-3xl border-2 border-[#8B5CF6] shadow-lavender-md hover:shadow-lavender-lg transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-center text-xs text-[#6B7280] font-semibold">
            <span className="flex items-center space-x-1.5 text-[#8B5CF6] font-bold">
              <span>Brand Compliance Score</span>
              <Info className="w-3.5 h-3.5" />
            </span>
            <BarChart3 className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-[#2D1B69] mt-2">{totalComplianceScore}%</p>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#8B5CF6] mt-1">
            <span>Automated Governance</span>
            <span className="text-[10px] underline group-hover:text-[#7C3AED]">Inspect Breakdown →</span>
          </div>
        </div>

        {/* Creator Turnaround Speed Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm">
          <div className="flex justify-between items-center text-xs text-[#6B7280] font-semibold">
            <span>Creator Turnaround Speed</span>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2D1B69] mt-2">0 Days</p>
          <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1 mt-1">
            Instant AI Delivery
          </span>
        </div>

      </div>

      {/* Chart Row 1: Monthly Projects & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Projects Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2D1B69]">Monthly Project Output</h3>
              <p className="text-xs text-[#6B7280]">Business vs Creator output comparison</p>
            </div>
            <span className="text-xs bg-[#F3F0FF] text-[#8B5CF6] font-bold px-3 py-1 rounded-full">
              2026 Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyProjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F0FF" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E9D5FF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Business" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Creator" fill="#C4B5FD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage Breakdown Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#2D1B69]">AI Asset Category Distribution</h3>
            <span className="text-xs text-[#6B7280]">By Platform</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.aiUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="percentage"
                  nameKey="category"
                >
                  {analyticsData.aiUsage.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E9D5FF',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {analyticsData.aiUsage.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-xs text-[#6B7280]">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.category} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Chart Row 2: Downloads Trend Area Chart */}
      <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#2D1B69]">Weekly Asset Export Velocity</h3>
            <p className="text-xs text-[#6B7280]">Daily high-resolution asset downloads</p>
          </div>
          <span className="text-xs text-[#8B5CF6] font-bold bg-[#F3F0FF] px-3 py-1 rounded-full border border-[#E9D5FF]">
            Export Velocity Tracker
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.downloads}>
              <defs>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F0FF" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  borderColor: '#E9D5FF',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="downloads" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BRAND COMPLIANCE SCORE BREAKDOWN MODAL */}
      {showComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B69]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E9D5FF] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Brand Compliance Inspector</h3>
                  <p className="text-xs text-purple-100">Live dynamic score calculated from your Brand Kit & Workflows</p>
                </div>
              </div>
              <button
                onClick={() => setShowComplianceModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-left">
              
              {/* Score Meter Banner */}
              <div className="p-5 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#E9D5FF] px-2.5 py-0.5 rounded-md">
                    Total Compliance Score
                  </span>
                  <div className="text-3xl font-extrabold text-[#2D1B69] mt-1">
                    {totalComplianceScore}% <span className="text-xs font-normal text-[#6B7280]">/ 100%</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {totalComplianceScore === 100
                      ? 'All brand governance criteria are fully active and enforced.'
                      : 'Complete your Brand Kit configuration to reach 100% governance compliance.'}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-[#8B5CF6] flex items-center justify-center bg-white shadow-inner font-extrabold text-[#8B5CF6] text-lg">
                  {totalComplianceScore}%
                </div>
              </div>

              {/* Breakdown Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D1B69]">
                  Compliance Rules & Point Allocation
                </h4>

                <div className="space-y-2.5">
                  {complianceItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl border border-[#E9D5FF] bg-white flex items-center justify-between gap-3 shadow-sm hover:border-[#8B5CF6] transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {item.isMet ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#2D1B69]">{item.title}</p>
                          <p className="text-[11px] text-[#6B7280]">{item.desc}</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          item.isMet ? 'bg-emerald-50 text-[#10B981]' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        +{item.score} / {item.maxScore} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Action Callout */}
              <div className="p-4 rounded-2xl bg-[#F3F0FF] border border-[#E9D5FF] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#2D1B69]">Need to update compliance rules?</p>
                  <p className="text-[11px] text-[#6B7280]">Modify colors, fonts, logo, or guidelines in Brand Kit settings.</p>
                </div>
                <button
                  onClick={() => {
                    setShowComplianceModal(false);
                    navigate('/business/brand-kit');
                  }}
                  className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 shrink-0"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Edit Brand Kit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
