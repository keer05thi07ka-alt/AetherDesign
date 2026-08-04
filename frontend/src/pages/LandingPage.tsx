import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Palette,
  Megaphone,
  Edit3,
  Grid,
  Users,
  BarChart3,
  FolderKanban,
  CheckCircle2,
  ChevronDown,
  Star,
} from 'lucide-react';
import { AnimatedDashboardIllustration } from '../components/landing/AnimatedDashboardIllustration';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const features = [
    {
      icon: Wand2,
      title: 'AI Content Generation',
      description: 'Generate multi-format marketing graphics, flyers, posters, logos, and social media banners in seconds.',
    },
    {
      icon: Palette,
      title: 'Brand Kit Management',
      description: 'Upload logos, define color palettes, typography, and tone to guarantee 100% brand consistency.',
    },
    {
      icon: Megaphone,
      title: 'Campaign Management',
      description: 'Organize multi-channel creative projects, set deadlines, track creator deliverables, and streamline approvals.',
    },
    {
      icon: Edit3,
      title: 'Canva-Style AI Editor',
      description: 'Customize AI outputs with intuitive drag-and-drop canvas, text formatting, layers, effects, and prompt fine-tuning.',
    },
    {
      icon: Grid,
      title: 'Template Library',
      description: 'Access thousands of professionally curated responsive templates for Instagram, LinkedIn, Web Banners, & Keynotes.',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Bridge the gap between Business teams and Creators with inline commentary, role permissions, and feedback loops.',
    },
    {
      icon: BarChart3,
      title: 'Creative Analytics',
      description: 'Track download counts, asset utilization, AI token usage, campaign velocity, and creator productivity.',
    },
    {
      icon: FolderKanban,
      title: 'Asset Vault Management',
      description: 'Store, tag, filter, search, and export high-resolution assets in PNG, SVG, PDF, and MP4 formats.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Business Creates Campaign',
      desc: 'Define campaign goals, platform requirements, target audience, and brand guidelines in a multi-step wizard.',
    },
    {
      num: '02',
      title: 'Assign Creator',
      desc: 'Pair your project with an in-house visual designer or external creative professional seamlessly.',
    },
    {
      num: '03',
      title: 'AI Generates Assets',
      desc: 'AetherDesign AI analyzes brand tokens and renders ultra-high-resolution design variations instantly.',
    },
    {
      num: '04',
      title: 'Creator Customizes',
      desc: 'Designers polish typography, tweak layers, adjust opacity, and fine-tune aesthetics on the canvas.',
    },
    {
      num: '05',
      title: 'Business Approves',
      desc: 'Stakeholders review live previews, leave timestamped feedback, approve final assets, and export.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'CMO at HyperScale SaaS',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      text: 'AetherDesign AI reduced our creative production workflow from 3 weeks to 48 hours. Our brand consistency across 6 global markets is now flawless.',
      stars: 5,
    },
    {
      name: 'David Chen',
      role: 'Creative Lead at StudioVibe',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'The dual Creator + Business workspace separation is brilliant. As a creator, I get powerful AI tools, while our clients get seamless approval workflows.',
      stars: 5,
    },
    {
      name: 'Amara Okafor',
      role: 'VP Marketing at OmniBrand',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      text: 'The Brand Kit integration ensures every single generated post automatically matches our primary colors and typography. Absolutely game-changing.',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'How does AetherDesign AI ensure strict brand consistency?',
      a: 'Through our central Brand Kit engine. When you set up your brand kit with primary/secondary colors, fonts, logos, and tone rules, our AI prompt pipeline enforces these constraints across every generated asset.',
    },
    {
      q: 'What is the difference between Business and Creator Workspaces?',
      a: 'The Business Workspace focuses on campaign strategy, brand kit configuration, creator assignments, analytics, and asset approvals. The Creator Workspace equips visual designers with AI prompt generators, template engines, asset vaults, and a full Canva-style editor.',
    },
    {
      q: 'Can I export high-resolution assets for print and web?',
      a: 'Yes! Assets can be exported in PNG, JPEG, SVG, and print-ready PDF formats up to 4K resolution.',
    },
    {
      q: 'Is there a limit on AI prompt generations?',
      a: 'Starter plans include 500 AI generations per month, while Pro and Enterprise plans offer unlimited high-resolution AI renders.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#C4B5FD]/40 to-[#8B5CF6]/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-[#F3F0FF] border border-[#E9D5FF] px-4 py-2 rounded-full shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#8B5CF6] animate-ping" />
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-semibold text-[#2D1B69]">
                Next-Gen Creative OS for Enterprise & Designers
              </span>
            </motion.div>

            {/* Large Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2D1B69] leading-[1.15]"
            >
              AI-Powered <br className="hidden sm:block" />
              <span className="gradient-text">Creative Content</span> Platform
            </motion.h1>

            {/* Sub Heading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#6B7280] leading-relaxed max-w-2xl"
            >
              Create professional digital content in seconds using AI while maintaining complete brand consistency. Empower businesses to launch campaigns and creators to deliver stunning visual assets seamlessly.
            </motion.p>

            {/* CTA Buttons - Dual Workspaces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
            >
              <Link
                to="/login/business"
                className="flex items-center justify-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-7 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.02]"
              >
                <Palette className="w-4 h-4 hidden" />
                <span>Business Workspace Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login/creator"
                className="flex items-center justify-center space-x-2 bg-white hover:bg-[#F3F0FF] text-[#2D1B69] border border-[#E9D5FF] px-7 py-4 rounded-2xl text-sm font-bold transition-all hover:shadow-md"
              >
                <span>Creator Workspace Login</span>
                <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-6 border-t border-[#E9D5FF]/60 flex items-center space-x-8 text-xs font-semibold text-[#6B7280]"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                <span>Dual Workspaces</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                <span>Instant 4K Export</span>
              </div>
            </motion.div>

          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5">
            <AnimatedDashboardIllustration />
          </div>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 bg-[#F3F0FF] border-y border-[#E9D5FF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="bg-white border border-[#E9D5FF] text-[#8B5CF6] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Comprehensive Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D1B69]">
              Everything You Need to Power Your Visual Ecosystem
            </h2>
            <p className="text-base text-[#6B7280]">
              From intelligent AI asset generation to brand governance and Canva-style fine-tuning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2D1B69] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="bg-[#F3F0FF] border border-[#E9D5FF] text-[#8B5CF6] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D1B69]">
            How AetherDesign AI Connects Brands & Creators
          </h2>
          <p className="text-base text-[#6B7280]">
            A 5-step collaborative process engineered for speed, accuracy, and brand governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm text-left flex flex-col justify-between">
              <div>
                <span className="text-3xl font-extrabold text-[#C4B5FD] block mb-3 font-mono">
                  {step.num}
                </span>
                <h4 className="font-bold text-sm text-[#2D1B69] mb-2">{step.title}</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#8B5CF6] text-white p-1 rounded-full shadow-md">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-[#F3F0FF] py-16 border-y border-[#E9D5FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="bg-white border border-[#E9D5FF] text-[#8B5CF6] text-xs font-bold px-3 py-1 rounded-full">
              Loved by Industry Leaders
            </span>
            <h2 className="text-3xl font-bold text-[#2D1B69]">What Brands & Creators Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-amber-400">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#2D1B69] leading-relaxed italic">"{t.text}"</p>
                </div>

                <div className="flex items-center space-x-3 pt-6 border-t border-[#F3F0FF] mt-6">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-xl object-cover border border-[#C4B5FD]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#2D1B69]">{t.name}</h5>
                    <p className="text-[11px] text-[#6B7280]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12 space-y-3">
          <span className="bg-[#F3F0FF] text-[#8B5CF6] text-xs font-bold px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-bold text-[#2D1B69]">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#E9D5FF] overflow-hidden text-left shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between font-bold text-sm text-[#2D1B69] hover:bg-[#F8F7FF] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#8B5CF6] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#6B7280] leading-relaxed border-t border-[#F3F0FF] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
