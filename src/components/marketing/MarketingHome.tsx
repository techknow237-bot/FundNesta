import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Smartphone,
  Users,
  Target,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lock,
  Wifi,
  Zap,
  Building2,
  TrendingUp,
  Wallet,
  ChevronRight,
  Play,
  Award,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarketingHome: React.FC = () => {
  const { setScreen, setAuthMode, t, language, setLanguage, formatMoney } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: Target,
      title: t('feature_goals_title'),
      desc: t('feature_goals_desc'),
      badge: 'GOALS ENGINE',
      color: 'from-emerald-500 to-cyan-500',
      stat: '98% On-Track',
    },
    {
      icon: Users,
      title: t('feature_njangi_title'),
      desc: t('feature_njangi_desc'),
      badge: 'NJANGI & TONTINE',
      color: 'from-cyan-500 to-blue-600',
      stat: 'Zero Default Risk',
    },
    {
      icon: Wifi,
      title: t('feature_offline_title'),
      desc: t('feature_offline_desc'),
      badge: '100% OFFLINE',
      color: 'from-amber-500 to-yellow-600',
      stat: 'Zero Data Needed',
    },
    {
      icon: Lock,
      title: t('feature_security_title'),
      desc: t('feature_security_desc'),
      badge: 'PIN & BIOMETRICS',
      color: 'from-purple-500 to-pink-600',
      stat: 'Bank-Grade AES',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Link MoMo & Orange Money',
      desc: 'Seamlessly track your Cameroon Mobile Money wallets and UBA / BICEC bank balances in one unified whole-number XAF ledger.',
      icon: Smartphone,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      num: '02',
      title: 'Automate Njangi & Tontines',
      desc: 'Never miss your group contribution turn again. Live circular pot rotations with clear SMS alert reminders.',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      num: '03',
      title: 'Achieve XAF Savings Goals',
      desc: 'Set targets for land, education, or emergency funds. Watch your savings progress rings fill up in real time.',
      icon: Target,
      color: 'from-amber-500 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#080b12] text-white overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* 1. ELEVATED FLOATING CAPSULE TOP BAR (RESPONSIVE & MOBILE-READY) */}
      <div className="sticky top-3 sm:top-4 z-50 px-2.5 sm:px-4 w-full max-w-6xl mx-auto transition-all duration-300">
        <header
          className={`w-full rounded-2xl transition-all duration-500 px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border ${
            scrolled
              ? 'bg-[#0f1523]/95 backdrop-blur-2xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
              : 'bg-[#141a29]/80 backdrop-blur-xl border-white/10 shadow-lg'
          }`}
        >
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                FN
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#080b12] flex items-center justify-center text-[9px]">
                🇨🇲
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">FundNesta</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  XAF
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:block -mt-0.5">
                Cameroon Fintech Engine
              </span>
            </div>
          </div>

          {/* Center: Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => scrollToSection('section-features')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('section-workflow')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('section-security')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Security
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'en' ? 'EN' : 'FR'}</span>
            </button>

            {/* Login button */}
            <button
              onClick={() => {
                setAuthMode('login');
                setScreen('auth');
              }}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              {t('log_in')}
            </button>

            {/* Demo CTA (Desktop) */}
            <button
              onClick={() => {
                setAuthMode('register');
                setScreen('auth');
              }}
              className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 text-xs font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition-all items-center space-x-1.5"
            >
              <span>{t('try_demo_now')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* MOBILE DROPDOWN DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 p-5 rounded-2xl bg-[#0f1523]/95 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 border-b border-white/10 pb-4">
              <button
                onClick={() => scrollToSection('section-features')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white flex items-center justify-between"
              >
                <span>Features & Capabilities</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => scrollToSection('section-workflow')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white flex items-center justify-between"
              >
                <span>How It Works (3 Steps)</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => scrollToSection('section-security')}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white flex items-center justify-between"
              >
                <span>Security & Privacy</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthMode('register');
                  setScreen('auth');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center space-x-2"
              >
                <span>{t('try_demo_now')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setScreen('onboarding');
                }}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm text-center"
              >
                {t('create_free_account')}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-6 sm:pt-10 pb-14 sm:pb-20 max-w-5xl mx-auto text-center">
        {/* Glow ambient background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/15 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 mb-5 sm:mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t('tagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.14] sm:leading-tight mb-4 sm:mb-6">
            Every Franc,{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Accounted For.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-1">
            {t('hero_subtitle')}
          </p>

          {/* Hero Actions (Stack nicely on mobile) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-xs sm:max-w-md mx-auto mb-10 sm:mb-14">
            <button
              onClick={() => {
                setAuthMode('register');
                setScreen('auth');
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_35px_rgba(16,185,129,0.45)] active:scale-98 transition-all group"
            >
              <span>{t('try_demo_now')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setScreen('auth');
              }}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all text-center"
            >
              {t('create_free_account')}
            </button>
          </div>

          {/* Mobile Trust Highlights Strip */}
          <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto mb-10 text-center text-[10px] sm:text-xs text-gray-300 font-medium">
            <div className="flex flex-col items-center justify-center">
              <span className="text-emerald-400 font-bold">XAF Native</span>
              <span className="text-gray-400 text-[9px] sm:text-[10px]">Whole-Number</span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-white/10">
              <span className="text-cyan-400 font-bold">100% Offline</span>
              <span className="text-gray-400 text-[9px] sm:text-[10px]">No Data Need</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-amber-400 font-bold">MoMo & OM</span>
              <span className="text-gray-400 text-[9px] sm:text-[10px]">Cameroon Ready</span>
            </div>
          </div>
        </motion.div>

        {/* 3D HIGH-END POP-UP HERO MOCKUP CARD ON SCROLL (MOBILE-OPTIMIZED) */}
        <motion.div
          initial={{ opacity: 0, rotateX: 12, scale: 0.94, y: 50 }}
          whileInView={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          style={{ perspective: 1200 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl bg-gradient-to-tr from-[#121826] via-[#161e31] to-[#121826] p-5 sm:p-8 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

            {/* Interactive Mockup Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                    Cameroon Net Worth Live
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    845,000 <span className="text-emerald-400 text-sm">XAF</span>
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <span className="w-full sm:w-auto px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold flex items-center justify-center sm:justify-start space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>MTN MoMo & Orange Money Active</span>
                </span>
              </div>
            </div>

            {/* Mockup Cards Grid (Stacked cleanly on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-left">
              {/* Card 1: MTN MoMo Balance */}
              <motion.div
                whileHover={{ scale: 1.02, translateZ: 8 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400">MTN Mobile Money</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    679 •• •• 10
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-white mb-1">
                  420,000 XAF
                </div>
                <span className="text-[11px] text-gray-400 block">Instant SMS Sync Enabled</span>
              </motion.div>

              {/* Card 2: Njangi Group Pot */}
              <motion.div
                whileHover={{ scale: 1.02, translateZ: 8 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400">Douala Tech Tontine</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Round 4/12
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-white mb-1">
                  600,000 XAF
                </div>
                <span className="text-[11px] text-emerald-400 font-medium block">Next Turn: You (Sept 15)</span>
              </motion.div>

              {/* Card 3: Orange Money */}
              <motion.div
                whileHover={{ scale: 1.02, translateZ: 8 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-orange-400">Orange Money</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold">
                    690 •• •• 22
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-white mb-1">
                  310,000 XAF
                </div>
                <span className="text-[11px] text-gray-400 block">Auto-budget ENEO & CAMWATER</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Cameroon payment partner logos badge (Responsive 2x2 on mobile) */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-xs text-gray-400 font-medium">
          <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-white/5 sm:bg-transparent border border-white/5 sm:border-transparent">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span>MTN Mobile Money</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-white/5 sm:bg-transparent border border-white/5 sm:border-transparent">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span>Orange Money</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-white/5 sm:bg-transparent border border-white/5 sm:border-transparent">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span>Njangi & Tontines</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-white/5 sm:bg-transparent border border-white/5 sm:border-transparent">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
            <span>UBA Cameroon</span>
          </div>
        </div>
      </section>

      {/* 2. 3D POP-UP SECTION: HOW IT WORKS IN 3 STEPS */}
      <section id="section-workflow" className="px-4 py-14 sm:py-20 max-w-6xl mx-auto border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            SIMPLE & NATIVE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 sm:mb-3">
            How FundNesta Empowers Cameroonians
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto px-1">
            From Douala to Yaoundé and Bamenda, manage your entire financial life with zero currency conversion headaches.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" style={{ perspective: 1200 }}>
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1, type: 'spring', bounce: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#141a29] to-[#0e131f] border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl group"
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${st.color} p-0.5 flex items-center justify-center shadow-lg`}>
                    <div className="w-full h-full rounded-2xl bg-[#0e131f] flex items-center justify-center">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-white/20 group-hover:text-emerald-400/50 transition-colors">
                    {st.num}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {st.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. 3D POP-UP SECTION: FEATURE SHOWCASE */}
      <section id="section-features" className="px-4 py-14 sm:py-20 max-w-6xl mx-auto border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            ENGINEERED FOR CAMEROON
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 sm:mb-3">
            XAF Whole-Number Precision & Offline Power
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto px-1">
            Unlike foreign apps, FundNesta is built specifically for Central African Francs, Tontine group savings, and reliable offline access.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{ perspective: 1200 }}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1, type: 'spring', bounce: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 sm:p-7 rounded-3xl bg-[#141a29]/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-all shadow-2xl group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${feat.color} p-0.5 flex items-center justify-center shadow-md shrink-0`}>
                    <div className="w-full h-full rounded-2xl bg-[#0c0f17] flex items-center justify-center">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-1">
                      {feat.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-gray-300">
                      {feat.stat}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. 3D POP-UP SECTION: SECURITY & PRIVACY BANNER */}
      <section id="section-security" className="px-4 py-12 sm:py-16 max-w-5xl mx-auto" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-tr from-[#141a29] via-[#1a233a] to-[#141a29] border border-white/15 shadow-[0_20px_60px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden"
        >
          {/* Subtle glow orb */}
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="flex-1 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 sm:mb-4">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% PRIVATE & ENCRYPTED</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3 tracking-tight">
              Your Financial Privacy is Non-Negotiable
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              FundNesta uses 4-digit PIN code protection, biometric fingerprint unlock, and local-first encryption so your XAF balances and Tontine savings remain strictly confidential.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthMode('register');
              setScreen('auth');
            }}
            className="w-full md:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm whitespace-nowrap shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <span>{t('try_demo_now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 sm:py-10 px-4 text-center text-xs text-gray-500 mb-14 sm:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
              FN
            </div>
            <span className="font-bold text-gray-300">FundNesta Cameroon</span>
          </div>
          <p>© 2026 FundNesta. XAF Whole-Number Native • MTN MoMo & Orange Money • Njangi Engine.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      {/* MOBILE-ONLY STICKY QUICK-ACTION BOTTOM BAR (Appears on Scroll) */}
      {scrolled && !mobileMenuOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="sm:hidden fixed bottom-3 left-3 right-3 z-50 p-2.5 rounded-2xl bg-[#0f1523]/95 backdrop-blur-2xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2"
        >
          <div className="flex items-center space-x-2.5 pl-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              FN
            </div>
            <div>
              <span className="text-xs font-bold text-white block">FundNesta App</span>
              <span className="text-[10px] text-emerald-400 font-medium block -mt-0.5">XAF Mobile Money</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                setAuthMode('register');
                setScreen('auth');
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setScreen('auth');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center space-x-1"
            >
              <span>{t('try_demo_now')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};


