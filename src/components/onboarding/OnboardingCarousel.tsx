import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, PieChart, Smartphone, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingCarousel: React.FC = () => {
  const { setScreen, t } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: t('onb_1_title'),
      desc: t('onb_1_desc'),
      badge: 'XAF NATIVE',
      icon: Sparkles,
      color: 'from-emerald-500 to-cyan-500',
    },
    {
      id: 1,
      title: t('onb_2_title'),
      desc: t('onb_2_desc'),
      badge: 'GOALS & MILESTONES',
      icon: PieChart,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 2,
      title: t('onb_3_title'),
      desc: t('onb_3_desc'),
      badge: 'CAMEROON FINTECH',
      icon: Smartphone,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: 3,
      title: t('onb_4_title'),
      desc: t('onb_4_desc'),
      badge: 'SMART BUDGETS',
      icon: PieChart,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 4,
      title: t('onb_5_title'),
      desc: t('onb_5_desc'),
      badge: 'BANK-GRADE SECURITY',
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setScreen('auth');
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen w-full bg-[#080b12] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
            FN
          </div>
          <span className="text-sm font-bold text-white tracking-tight">FundNesta</span>
        </div>
        <button
          onClick={() => setScreen('marketing')}
          className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          {t('skip')}
        </button>
      </div>

      {/* Main Slide Illustration Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full text-center flex flex-col items-center"
          >
            {/* Animated Glow Orb */}
            <div className="relative mb-10">
              <div className={`w-36 h-36 rounded-3xl bg-gradient-to-tr ${slide.color} opacity-20 blur-2xl absolute -inset-4 animate-pulse`} />
              <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-tr ${slide.color} p-0.5 shadow-xl flex items-center justify-center`}>
                <div className="w-full h-full rounded-3xl bg-[#141a29] flex items-center justify-center">
                  <Icon className="w-14 h-14 text-white" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
              {slide.badge}
            </span>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              {slide.title}
            </h2>

            {/* Subtext */}
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="max-w-md mx-auto w-full z-10">
        {/* Progress Dots */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-gradient-to-r from-emerald-400 to-cyan-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setScreen('marketing')}
            className="w-1/3 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors"
          >
            {t('home')}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-98 transition-all"
          >
            <span>{currentSlide === slides.length - 1 ? t('get_started') : t('next')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
