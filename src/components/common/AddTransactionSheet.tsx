import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  ArrowRight,
  Sparkles,
  Utensils,
  Navigation,
  Zap,
  Wifi,
  Users,
  ShoppingBag,
  HeartPulse,
  Home,
  GraduationCap,
  Car,
  ShieldCheck,
  Smartphone,
  Building2,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';

interface AddTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'Food & Supermarket': Utensils,
  'Alimentation & Supermarché': Utensils,
  'Transport (Yango / Taxi)': Navigation,
  'ENEO & CAMWATER Bills': Zap,
  'Factures ENEO & CAMWATER': Zap,
  'MTN & Orange Data / Airtime': Wifi,
  'Forfaits Internet & Crédit': Wifi,
  'Njangi / Tontine Dues': Users,
  'Cotisations Tontine / Njangi': Users,
  'Shopping': ShoppingBag,
  'Health': HeartPulse,
  'Rent': Home,
  'Education': GraduationCap,
  'Savings Goals': TargetIcon,
};

function TargetIcon({ className }: { className?: string }) {
  return <Car className={className} />;
}

export const AddTransactionSheet: React.FC<AddTransactionSheetProps> = ({ isOpen, onClose }) => {
  const {
    t,
    language,
    accounts,
    savingsGoals,
    budgets,
    addTransaction,
    formatMoney,
    confirmAction,
  } = useApp();

  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Food & Supermarket');
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || 'acc-momo');
  const [selectedGoal, setSelectedGoal] = useState<string>(savingsGoals[0]?.id || '');
  const [note, setNote] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [isFlying, setIsFlying] = useState<boolean>(false);

  if (!isOpen) return null;

  const numericAmount = parseInt(amountStr || '0', 10);

  const handleKeypad = (digit: string) => {
    if (digit === 'BACK') {
      setAmountStr(prev => prev.slice(0, -1));
    } else if (digit === 'CLEAR') {
      setAmountStr('');
    } else {
      if (amountStr.length < 9) {
        setAmountStr(prev => prev + digit);
      }
    }
  };

  const handleSave = () => {
    if (!numericAmount || numericAmount <= 0) return;
    if (txType === 'goal_deposit' && !selectedGoal) {
      alert(t('please_select_goal') || 'Please create or select a savings goal first.');
      return;
    }

    const tabLabel =
      txType === 'expense'
        ? language === 'fr'
          ? 'Dépense'
          : 'Expense'
        : txType === 'income'
        ? language === 'fr'
          ? 'Revenu'
          : 'Income'
        : txType === 'goal_deposit'
        ? language === 'fr'
          ? 'Dépôt objectif'
          : 'Goal Deposit'
        : language === 'fr'
        ? 'Cotisation Tontine'
        : 'Njangi Contribution';

    confirmAction({
      title: language === 'fr' ? 'Confirmer l’opération' : 'Confirm Transaction',
      description:
        language === 'fr'
          ? `Voulez-vous vraiment enregistrer cette opération (${tabLabel}) de ${formatMoney(numericAmount)} ?`
          : `Are you sure you want to record this ${tabLabel} transaction of ${formatMoney(numericAmount)}?`,
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Enregistrer' : 'Confirm & Save',
      cancelLabel: language === 'fr' ? 'Annuler' : 'Cancel',
      onConfirm: () => {
        setIsFlying(true);

        setTimeout(() => {
          addTransaction({
            type: txType,
            amount: numericAmount,
            category: selectedCategory,
            accountId: selectedAccount,
            ...(txType === 'goal_deposit' && selectedGoal ? { toGoalId: selectedGoal } : {}),
            note: note || `${txType.toUpperCase()} record`,
            date: new Date().toISOString().split('T')[0],
            isRecurring,
          });
          setIsFlying(false);
          setAmountStr('');
          setNote('');
          onClose();
        }, 600);
      },
    });
  };

  const defaultExpenseCategories = [
    'Food & Supermarket',
    'Transport (Yango / Taxi)',
    'ENEO & CAMWATER Bills',
    'MTN & Orange Data / Airtime',
    'Shopping & Entertainment',
    'General Expense',
  ];

  const availableCategories =
    txType === 'expense'
      ? budgets.length > 0
        ? budgets.map(b => (language === 'fr' ? b.nameFr : b.name))
        : defaultExpenseCategories
      : ['Salary', 'Freelance', 'Gift', 'MoMo Transfer', 'Investment Return'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-t-3xl bg-[#141a29] border-t border-white/10 p-5 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{t('add_transaction')}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Control: Expense / Income / Goal Deposit / Njangi */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#0c0f17] border border-white/5 mb-5">
            {(
              [
                { id: 'expense', label: t('expense') },
                { id: 'income', label: t('income') },
                { id: 'goal_deposit', label: t('goal_deposit') },
                { id: 'njangi', label: t('njangi') },
              ] as { id: TransactionType; label: string }[]
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setTxType(tab.id)}
                className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
                  txType === tab.id
                    ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Large Amount Display in XAF */}
          <div className="text-center py-4 px-3 mb-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <span className="text-xs text-gray-400 block uppercase tracking-wider mb-1">
              {t('amount_xaf')}
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center space-x-1">
              <span>{numericAmount ? formatMoney(numericAmount) : '0 XAF'}</span>
            </div>

            {/* Flying amount animation simulation */}
            {isFlying && (
              <motion.div
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{ opacity: 0, scale: 0.3, y: -180, x: 60 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 rounded-2xl text-white font-bold text-xl"
              >
                + {formatMoney(numericAmount)}
              </motion.div>
            )}
          </div>

          {/* Custom Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'BACK'].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleKeypad(btn)}
                className={`py-2.5 rounded-xl font-semibold text-sm border transition-all active:scale-95 ${
                  btn === 'CLEAR'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                    : btn === 'BACK'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-base'
                }`}
              >
                {btn === 'BACK' ? '⌫' : btn}
              </button>
            ))}
          </div>

          {/* Account Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              {t('select_account')}
            </label>
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {accounts.map(acc => {
                const isSelected = selectedAccount === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-white/15 border-emerald-500 text-white shadow'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category or Goal selector */}
          {txType === 'goal_deposit' ? (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Select Savings Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {savingsGoals.map(goal => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border-emerald-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-semibold truncate">
                        {language === 'fr' ? goal.titleFr || goal.title : goal.title}
                      </span>
                      <span className="text-emerald-400 font-mono ml-2">
                        {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('select_category')}
              </label>
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {availableCategories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 border-emerald-400 text-white shadow'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Note */}
          <div className="mb-5">
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={t('note_label')}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!numericAmount || numericAmount <= 0}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-lg transition-all ${
              numericAmount && numericAmount > 0
                ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 active:scale-98 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>
              {txType === 'goal_deposit' ? t('add_to_goal') : t('save')} ({numericAmount ? formatMoney(numericAmount) : '0 XAF'})
            </span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
