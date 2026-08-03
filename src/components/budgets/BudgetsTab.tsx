import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  Utensils,
  Navigation,
  Zap,
  Wifi,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { ProgressRing } from '../common/ProgressRing';

const BUDGET_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Navigation,
  Zap,
  Wifi,
  Users,
};

export const BudgetsTab: React.FC = () => {
  const { t, language, budgets, addBudget, formatMoney, confirmAction } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newLimit, setNewLimit] = useState('100000');
  const [newThreshold, setNewThreshold] = useState('80');

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPct = Math.min(100, Math.round((totalSpent / totalBudgeted) * 100));

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseInt(newLimit, 10);
    const threshNum = parseInt(newThreshold, 10) || 80;
    if (newCatName && limitNum > 0) {
      confirmAction({
        title: language === 'fr' ? 'Confirmer le budget' : 'Confirm Budget',
        description:
          language === 'fr'
            ? `Voulez-vous créer le budget "${newCatName}" avec un plafond de ${formatMoney(limitNum)} ?`
            : `Are you sure you want to create the budget "${newCatName}" with a limit of ${formatMoney(limitNum)}?`,
        variant: 'primary',
        confirmLabel: language === 'fr' ? 'Créer le budget' : 'Create Budget',
        onConfirm: () => {
          addBudget({
            name: newCatName,
            nameFr: newCatName,
            icon: 'Utensils',
            limit: limitNum,
            spent: 0,
            period: 'monthly',
            color: 'from-emerald-500 to-cyan-500',
            alertThreshold: threshNum,
          });
          setNewCatName('');
          setIsModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* 1. Overview Card */}
      <GlassCard variant="accent" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              {t('budget_overview')}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('create_budget')}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-2xl sm:text-4xl font-black font-mono text-white block">
              {formatMoney(totalSpent)}
            </span>
            <span className="text-xs text-gray-400">
              {language === 'fr'
                ? `sur ${formatMoney(totalBudgeted)} de budget mensuel total`
                : `of ${formatMoney(totalBudgeted)} total monthly budget`}
            </span>

            <div className="mt-4 flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-gray-300 font-semibold">
                29 {t('days_left_in_period')}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProgressRing percentage={overallPct} size={110} strokeWidth={10} isBudget />
          </div>
        </div>
      </GlassCard>

      {/* 2. Budget Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(bud => {
          const pct = Math.round((bud.spent / bud.limit) * 100);
          const isWarning = pct >= bud.alertThreshold && pct < 100;
          const isOver = pct >= 100;
          const title = language === 'fr' ? bud.nameFr : bud.name;
          const IconComponent = BUDGET_ICONS[bud.icon] || PieChart;

          return (
            <GlassCard
              key={bud.id}
              className="p-5 flex items-center justify-between border-white/10"
              hoverEffect
              glowColor={isOver ? 'coral' : isWarning ? 'amber' : 'emerald'}
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${bud.color} p-0.5 flex items-center justify-center`}>
                    <div className="w-full h-full rounded-xl bg-[#0c0f17] flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white block">{title}</h3>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                      {language === 'fr' ? 'Limite Mensuelle' : 'Monthly Limit'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, pct)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isOver
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span
                    className={`font-bold ${
                      isOver
                        ? 'text-rose-400'
                        : isWarning
                        ? 'text-amber-400'
                        : 'text-white'
                    }`}
                  >
                    {formatMoney(bud.spent)}
                  </span>
                  <span className="text-gray-400">
                    {language === 'fr' ? 'Limite :' : 'Limit:'} {formatMoney(bud.limit)}
                  </span>
                </div>

                {/* Warning badges */}
                {isOver && (
                  <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-[10px] font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t('budget_alert_100')}</span>
                  </div>
                )}
                {isWarning && !isOver && (
                  <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t('budget_alert_80')}</span>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <ProgressRing percentage={pct} size={64} strokeWidth={6} isBudget />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* CREATE BUDGET MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-[#141a29] border border-white/10 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">{t('create_budget')}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Health, Entertainment"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Monthly Limit (XAF)
                  </label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                    placeholder="100000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('alert_threshold')}
                  </label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={e => setNewThreshold(e.target.value)}
                    placeholder="80"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg"
                  >
                    {t('save')} Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
