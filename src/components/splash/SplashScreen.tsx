import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { setScreen, t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto advance to Marketing Home / Onboarding
      setScreen('marketing');
    }, 2800);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div className="relative min-h-screen w-full bg-[#080b12] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background glowing particles/orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />

      {/* Central Logo & Tagline */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-[0_0_50px_rgba(16,185,129,0.35)] mb-6">
          <div className="w-full h-full rounded-3xl bg-[#0c0f17] flex items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tighter bg-gradient-to-tr from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FN
            </span>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 items-center justify-center text-[10px] font-bold text-white">
              XAF
            </span>
          </span>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-black text-white tracking-tight mb-2"
        >
          FundNesta
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm font-medium text-emerald-400/90 tracking-wide uppercase"
        >
          {t('tagline')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xs text-gray-500 mt-2 max-w-xs"
        >
          {t('sub_tagline')}
        </motion.p>
      </motion.div>

      {/* Skip button for immediate access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 z-20"
      >
        <button
          onClick={() => setScreen('marketing')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors"
        >
          <span>{t('try_demo_now')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
