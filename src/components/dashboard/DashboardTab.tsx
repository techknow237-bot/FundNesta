import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Smartphone,
  Building2,
  Wallet,
  PiggyBank,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Calendar,
  Users,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { ProgressRing } from '../common/ProgressRing';
import { GlassCard } from '../common/GlassCard';

export const DashboardTab: React.FC = () => {
  const {
    t,
    language,
    accounts,
    budgets,
    transactions,
    savingsGoals,
    njangiGroup,
    recurringBills,
    formatMoney,
    setMainTab,
    setIsAddSheetOpen,
  } = useApp();

  const [insightIdx, setInsightIdx] = useState(0);

  // 1. Calculate dynamic balance & monthly cashflow
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const monthlyIncome = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const monthlyExpense = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'expense' || tx.type === 'njangi')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.max(0, Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100));
  }, [monthlyIncome, monthlyExpense]);

  const totalBudgetLimit = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.limit, 0);
  }, [budgets]);

  const totalBudgetSpent = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.spent, 0);
  }, [budgets]);

  const budgetUsagePct = useMemo(() => {
    if (totalBudgetLimit <= 0) return 0;
    return Math.round((totalBudgetSpent / totalBudgetLimit) * 100);
  }, [totalBudgetSpent, totalBudgetLimit]);

  // 2. Dynamic Smart Insights generated from real user data
  const dynamicInsights = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      message: React.ReactNode;
      type: 'positive' | 'warning' | 'info';
    }> = [];

    // Check Njangi Turn / contribution
    if (njangiGroup) {
      if (njangiGroup.isUserTurn) {
        list.push({
          id: 'njangi_turn',
          title: language === 'fr' ? 'Tour Njangi Actif' : 'Your Njangi Turn!',
          type: 'positive',
          message: (
            <>
              {language === 'fr'
                ? '🎉 C’est votre tour de recevoir la cagnotte Njangi de '
                : '🎉 It is your turn to receive the Njangi pot of '}
              <span className="text-emerald-400 font-bold">
                {formatMoney(njangiGroup.potAmount)}
              </span>{' '}
              {language === 'fr' ? `dans le groupe ${njangiGroup.name}.` : `in ${njangiGroup.name}.`}
            </>
          ),
        });
      } else {
        list.push({
          id: 'njangi_upcoming',
          title: language === 'fr' ? 'Prochaine Cotisation Njangi' : 'Upcoming Njangi Contribution',
          type: 'info',
          message: (
            <>
              {language === 'fr'
                ? 'Cotisation prévue de '
                : 'You have an upcoming contribution of '}
              <span className="text-cyan-400 font-bold">
                {formatMoney(njangiGroup.contributionAmount)}
              </span>{' '}
              {language === 'fr'
                ? `le ${njangiGroup.nextContributionDate} (${njangiGroup.name}).`
                : `on ${njangiGroup.nextContributionDate} (${njangiGroup.name}).`}
            </>
          ),
        });
      }
    }

    // Check Savings Goal progress
    if (savingsGoals.length > 0) {
      const topGoal = savingsGoals[0];
      const goalPct = Math.min(100, Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100));
      list.push({
        id: 'savings_goal',
        title: language === 'fr' ? 'Évolution de l’Épargne' : 'Savings Progress',
        type: goalPct >= 80 ? 'positive' : 'info',
        message: (
          <>
            {language === 'fr' ? 'Vous avez atteint ' : 'You’ve reached '}
            <span className="text-emerald-400 font-bold">{goalPct}%</span>{' '}
            {language === 'fr'
              ? `de votre objectif "${topGoal.title}" (${formatMoney(topGoal.currentAmount)} / ${formatMoney(topGoal.targetAmount)}).`
              : `of your "${topGoal.title}" goal (${formatMoney(topGoal.currentAmount)} / ${formatMoney(topGoal.targetAmount)}).`}
          </>
        ),
      });
    }

    // Check for any budget warning
    const alertBudget = budgets.find(b => b.spent >= b.limit * 0.85);
    if (alertBudget) {
      const pct = Math.round((alertBudget.spent / alertBudget.limit) * 100);
      list.push({
        id: 'budget_alert',
        title: language === 'fr' ? 'Alerte Budget' : 'Budget Alert',
        type: 'warning',
        message: (
          <>
            {language === 'fr'
              ? `⚠️ Attention : Votre budget "${alertBudget.name}" est à `
              : `⚠️ Careful: Your "${alertBudget.name}" budget is at `}
            <span className="text-amber-400 font-bold">{pct}%</span>{' '}
            {language === 'fr'
              ? `de sa limite (${formatMoney(alertBudget.spent)} / ${formatMoney(alertBudget.limit)}).`
              : `of its limit (${formatMoney(alertBudget.spent)} / ${formatMoney(alertBudget.limit)}).`}
          </>
        ),
      });
    }

    // Check Savings Rate
    if (savingsRate > 0) {
      list.push({
        id: 'savings_rate',
        title: language === 'fr' ? 'Taux d’Épargne' : 'Monthly Savings Rate',
        type: 'positive',
        message: (
          <>
            {language === 'fr'
              ? 'Excellent ! Votre taux d’épargne ce mois-ci est de '
              : 'Great job! Your savings rate this month is '}
            <span className="text-emerald-400 font-bold">{savingsRate}%</span>{' '}
            {language === 'fr'
              ? 'sur vos revenus globaux.'
              : 'of your total monthly income.'}
          </>
        ),
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'default_insight',
        title: language === 'fr' ? 'Conseil Financier' : 'Financial Tip',
        type: 'info',
        message: (
          <>
            {language === 'fr'
              ? 'Créez un budget ou un objectif d’épargne pour débloquer des analyses intelligentes en temps réel.'
              : 'Create a budget or savings goal to unlock real-time financial insights and recommendations.'}
          </>
        ),
      });
    }

    return list;
  }, [njangiGroup, savingsGoals, budgets, savingsRate, language, formatMoney]);

  const currentInsight = dynamicInsights[insightIdx % dynamicInsights.length];

  // 3. Calculate category spending breakdown
  const categorySpending = useMemo(() => {
    const map: { [key: string]: number } = {};
    transactions
      .filter(tx => tx.type === 'expense' || tx.type === 'njangi')
      .forEach(tx => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });

    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, amt]) => sum + amt, 0);

    return {
      entries: entries.slice(0, 4),
      total,
    };
  }, [transactions]);

  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* 1. TOTAL NET BALANCE HERO CARD */}
      <GlassCard variant="accent" className="p-6 sm:p-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            {t('total_balance')}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-emerald-300 border border-white/10">
            🇨🇲 XAF Native
          </span>
        </div>

        <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
          <AnimatedNumber value={totalBalance} />
        </div>

        {/* Account breakdown chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {accounts.slice(0, 4).map(acc => (
            <div
              key={acc.id}
              className="p-3 rounded-xl bg-[#0c0f17]/60 border border-white/10 flex flex-col"
            >
              <span className="text-[10px] text-gray-400 font-medium truncate mb-0.5">
                {acc.name}
              </span>
              <span className="text-xs font-bold font-mono text-white">
                {formatMoney(acc.balance)}
              </span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddSheetOpen(true)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>{t('add_money')} / Opération</span>
          </button>
          <button
            onClick={() => setMainTab('more')}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            {t('view_accounts')}
          </button>
        </div>
      </GlassCard>

      {/* 2. THIS MONTH SNAPSHOT WITH REAL SAVINGS RATE & BUDGET USAGE */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4" hoverEffect glowColor="emerald">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-gray-400">{t('income')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
            {formatMoney(monthlyIncome)}
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">
            {savingsRate > 0
              ? `${savingsRate}% ${language === 'fr' ? 'épargnés ce mois' : 'savings rate'}`
              : language === 'fr' ? 'Total revenus enregistrés' : 'Total recorded income'}
          </span>
        </GlassCard>

        <GlassCard className="p-4" hoverEffect glowColor="coral">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-xs font-semibold text-gray-400">{t('expense')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-rose-400">
            {formatMoney(monthlyExpense)}
          </div>
          <span className={`text-[10px] block mt-1 font-semibold ${
            budgetUsagePct > 100 ? 'text-rose-400' : 'text-gray-400'
          }`}>
            {budgetUsagePct > 0
              ? `${budgetUsagePct}% ${language === 'fr' ? 'du budget utilisé' : 'of budget spent'}`
              : language === 'fr' ? 'Dépenses du mois' : 'Monthly spending'}
          </span>
        </GlassCard>
      </div>

      {/* 3. DYNAMIC SMART INSIGHT CARD WITH CAROUSEL */}
      <GlassCard className="p-4 bg-gradient-to-tr from-[#161f33] to-[#1c2842] border-emerald-500/20">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {currentInsight.title}
                </span>
                {dynamicInsights.length > 1 && (
                  <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 rounded bg-white/5">
                    {(insightIdx % dynamicInsights.length) + 1}/{dynamicInsights.length}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-200 font-medium mt-1 leading-relaxed">
                {currentInsight.message}
              </p>
            </div>
          </div>

          {/* Navigation arrows if multiple insights */}
          {dynamicInsights.length > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setInsightIdx(prev => (prev - 1 + dynamicInsights.length) % dynamicInsights.length)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                title="Previous insight"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setInsightIdx(prev => (prev + 1) % dynamicInsights.length)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                title="Next insight"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* 4. DYNAMIC CATEGORY SPENDING BREAKDOWN */}
      {categorySpending.entries.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                {language === 'fr' ? 'Dépenses par Catégorie' : 'Spending by Category'}
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {formatMoney(categorySpending.total)}
            </span>
          </div>

          <div className="space-y-3">
            {categorySpending.entries.map(([cat, amount], i) => {
              const pct = categorySpending.total > 0
                ? Math.round((amount / categorySpending.total) * 100)
                : 0;
              const colors = [
                'bg-emerald-500',
                'bg-cyan-500',
                'bg-amber-500',
                'bg-rose-500',
              ];
              const color = colors[i % colors.length];

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-200">{cat}</span>
                    <span className="font-mono text-gray-400">
                      {formatMoney(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* 5. LIVE COMMITMENTS (NJANGI & RECURRING BILLS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Njangi Card */}
        {njangiGroup && (
          <GlassCard className="p-4" onClick={() => setMainTab('more')}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {language === 'fr' ? 'Groupe Njangi' : 'Njangi Group'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {njangiGroup.frequency}
              </span>
            </div>
            <div className="text-sm font-bold text-white mt-1">
              {njangiGroup.name}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-gray-400">
                {language === 'fr' ? 'Cotisation :' : 'Contribution:'}
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {formatMoney(njangiGroup.contributionAmount)}
              </span>
            </div>
          </GlassCard>
        )}

        {/* Next Bill Card */}
        {recurringBills.length > 0 && (
          <GlassCard className="p-4" onClick={() => setMainTab('more')}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {language === 'fr' ? 'Prochain Facture' : 'Next Recurring Bill'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {recurringBills[0].dueDate}
              </span>
            </div>
            <div className="text-sm font-bold text-white mt-1">
              {recurringBills[0].title}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-gray-400">
                {language === 'fr' ? 'Montant :' : 'Amount due:'}
              </span>
              <span className="font-mono font-bold text-amber-400">
                {formatMoney(recurringBills[0].amount)}
              </span>
            </div>
          </GlassCard>
        )}
      </div>

      {/* 6. BUDGET HEALTH STRIP (Horizontal Progress Rings) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">{t('budget_health')}</h3>
          <button
            onClick={() => setMainTab('budgets')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>{t('see_all')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
          {budgets.map((bud, idx) => {
            const pct = (bud.spent / bud.limit) * 100;
            const title = language === 'fr' ? bud.nameFr : bud.name;
            return (
              <GlassCard
                key={bud.id}
                onClick={() => setMainTab('budgets')}
                className="p-3.5 w-44 flex-shrink-0 flex flex-col items-center text-center"
              >
                <div className="mb-2">
                  <ProgressRing percentage={pct} size={64} strokeWidth={5} isBudget />
                </div>
                <span className="text-xs font-bold text-white truncate w-full block">
                  {title}
                </span>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {formatMoney(bud.spent)} / {formatMoney(bud.limit)}
                </span>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 7. RECENT TRANSACTIONS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">{t('recent_transactions')}</h3>
          <button
            onClick={() => setMainTab('transactions')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>{t('see_all')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTxs.length === 0 ? (
          <GlassCard className="p-8 text-center text-gray-400 text-xs">
            {t('no_recent_transactions')}
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {recentTxs.map((tx, idx) => {
              const isIncome = tx.type === 'income';
              const isGoal = tx.type === 'goal_deposit';
              return (
                <GlassCard key={tx.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                        isIncome
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : isGoal
                          ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                          : 'bg-white/5 border border-white/10 text-gray-300'
                      }`}
                    >
                      <span className="text-base font-bold">
                        {tx.category.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {tx.note || tx.category}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {tx.category} • {tx.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold ${
                      isIncome
                        ? 'text-emerald-400'
                        : isGoal
                        ? 'text-cyan-400'
                        : 'text-white'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                  </span>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

