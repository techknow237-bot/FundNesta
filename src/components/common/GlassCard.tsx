import React from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glowColor?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'coral' | 'none';
  variant?: 'dark' | 'subtle' | 'accent';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  glowColor = 'none',
  variant = 'dark',
}) => {
  const baseClasses = 'relative rounded-2xl border transition-all duration-300 overflow-hidden';

  const variantStyles = {
    dark: 'bg-[#141a29]/80 backdrop-blur-md border-white/10 text-white shadow-lg',
    subtle: 'bg-white/[0.04] backdrop-blur-sm border-white/5 text-white',
    accent: 'bg-gradient-to-br from-[#1c2438]/90 to-[#141a29]/90 backdrop-blur-lg border-white/15 text-white shadow-xl',
  };

  const glowStyles = {
    emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    violet: 'hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]',
    amber: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
    coral: 'hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]',
    none: '',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.015, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.985 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${variantStyles[variant]} ${glowStyles[glowColor]} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
