import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  X,
  Car,
  Home,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { ProgressRing } from '../common/ProgressRing';

const GOAL_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Car,
  Home,
  ShieldCheck,
  GraduationCap,
  Target,
};

export const SavingsGoalsTab: React.FC = () => {
  const {
    t,
    language,
    savingsGoals,
    accounts,
    formatMoney,
    depositToGoal,
    addSavingsGoal,
    confirmAction,
  } = useApp();

  const [activeDepositGoalId, setActiveDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('50000');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('1000000');
  const [newDate, setNewDate] = useState('2027-01-01');

  const totalSavedAcrossAll = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(depositAmount, 10);
    if (activeDepositGoalId && amount > 0) {
      const targetGoal = savingsGoals.find(g => g.id === activeDepositGoalId);
      const goalTitle = targetGoal ? targetGoal.title : '';
      confirmAction({
        title: language === 'fr' ? 'Confirmer le dépôt' : 'Confirm Deposit',
        description:
          language === 'fr'
            ? `Voulez-vous déposer ${formatMoney(amount)} dans l'objectif "${goalTitle}" ?`
            : `Are you sure you want to deposit ${formatMoney(amount)} into "${goalTitle}"?`,
        variant: 'success',
        confirmLabel: language === 'fr' ? 'Confirmer le dépôt' : 'Confirm Deposit',
        onConfirm: () => {
          depositToGoal(activeDepositGoalId, selectedAccount, amount);
          setActiveDepositGoalId(null);
        },
      });
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newTarget, 10);
    if (newTitle && amount > 0) {
      confirmAction({
        title: language === 'fr' ? 'Confirmer l’objectif' : 'Confirm Savings Goal',
        description:
          language === 'fr'
            ? `Voulez-vous créer l’objectif d'épargne "${newTitle}" avec une cible de ${formatMoney(amount)} ?`
            : `Are you sure you want to create the savings goal "${newTitle}" with a target of ${formatMoney(amount)}?`,
        variant: 'primary',
        confirmLabel: language === 'fr' ? 'Créer l’objectif' : 'Create Goal',
        onConfirm: () => {
          addSavingsGoal({
            title: newTitle,
            titleFr: newTitle,
            targetAmount: amount,
            currentAmount: 0,
            targetDate: newDate,
            category: 'Personal Savings',
            icon: 'Target',
            color: 'from-emerald-500 to-cyan-500',
          });
          setNewTitle('');
          setIsNewGoalModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* Header & Hero Stats */}
      <GlassCard variant="accent" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              {t('goals_hero_title')}
            </span>
          </div>
          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('create_new_goal')}</span>
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-6">{t('goals_subtitle')}</p>

        <div className="p-4 rounded-2xl bg-[#0c0f17]/60 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
              {t('total_saved_so_far')}
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {formatMoney(totalSavedAcrossAll)}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              {t('across_all_goals')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </GlassCard>

      {/* List of Active Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = pct >= 100;
          const title = language === 'fr' ? goal.titleFr || goal.title : goal.title;
          const IconComponent = GOAL_ICONS[goal.icon] || Target;

          return (
            <GlassCard
              key={goal.id}
              className="p-5 flex flex-col justify-between border-white/10"
              hoverEffect
              glowColor={isDone ? 'emerald' : 'cyan'}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${goal.color} p-0.5 flex items-center justify-center`}>
                      <div className="w-full h-full rounded-2xl bg-[#0c0f17] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{title}</h3>
                      <span className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{goal.targetDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-400 block">
                      {pct}%
                    </span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Completed!
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                  />
                </div>

                {/* Amounts display */}
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-white font-bold">{formatMoney(goal.currentAmount)}</span>
                  <span className="text-gray-400">Target: {formatMoney(goal.targetAmount)}</span>
                </div>

                {goal.notes && (
                  <p className="text-[11px] text-gray-400 bg-white/5 px-3 py-2 rounded-xl mb-4 italic">
                    “{goal.notes}”
                  </p>
                )}
              </div>

              {/* Deposit CTA */}
              {!isDone ? (
                <button
                  onClick={() => setActiveDepositGoalId(goal.id)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('add_to_goal')}</span>
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('goal_completed')}</span>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* DEPOSIT MODAL */}
      <AnimatePresence>
        {activeDepositGoalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-[#141a29] border border-white/10 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">{t('add_to_goal')}</h3>
                <button
                  onClick={() => setActiveDepositGoalId(null)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('deposit_amount_xaf')}
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('select_source_account')}
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={e => setSelectedAccount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0f17] border border-white/10 text-white font-medium text-xs focus:outline-none"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({formatMoney(acc.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveDepositGoalId(null)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg"
                  >
                    {t('confirm')} & Deposit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW GOAL MODAL */}
      <AnimatePresence>
        {isNewGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-[#141a29] border border-white/10 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">{t('create_new_goal')}</h3>
                <button
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('goal_title_label')}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Land in Kribi, Emergency Fund"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('target_amount_xaf')}
                  </label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={e => setNewTarget(e.target.value)}
                    placeholder="1000000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('target_date_label')}
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0f17] border border-white/10 text-white text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewGoalModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg"
                  >
                    {t('save')} Goal
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
