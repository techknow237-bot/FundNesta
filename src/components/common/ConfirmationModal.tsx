/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ConfirmModalOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
  onConfirm: () => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  options: ConfirmModalOptions | null;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  options,
  onClose,
}) => {
  const { language } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !options) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        options.onConfirm();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, onClose]);

  if (!options) return null;

  const {
    title,
    description,
    confirmLabel,
    cancelLabel,
    variant = 'primary',
    onConfirm,
  } = options;

  const defaultConfirmText =
    confirmLabel || (language === 'fr' ? 'Confirmer' : 'Confirm');
  const defaultCancelText =
    cancelLabel || (language === 'fr' ? 'Annuler' : 'Cancel');

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          buttonBg:
            'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-rose-500/25',
          icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
        };
      case 'success':
        return {
          badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          buttonBg:
            'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/25',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
        };
      case 'primary':
      default:
        return {
          badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          buttonBg:
            'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/25',
          icon: <HelpCircle className="w-6 h-6 text-cyan-400" />,
        };
    }
  };

  const styles = getVariantStyles();

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#0e1423] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Close button */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${styles.badgeBg}`}
              >
                {styles.icon}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {description}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-sm transition-all active:scale-95"
              >
                {defaultCancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirmClick}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-1.5 ${styles.buttonBg}`}
              >
                <ShieldAlert className="w-4 h-4 opacity-80" />
                <span>{defaultConfirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
