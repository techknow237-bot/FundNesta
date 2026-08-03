import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Smartphone,
  Building2,
  PiggyBank,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SetupWizard: React.FC = () => {
  const { setScreen, t, profile, updateProfile, accounts, budgets, savingsGoals, applySetupConfiguration, triggerConfetti } = useApp();
  const [step, setStep] = useState(1);

  const [selectedAccs, setSelectedAccs] = useState<string[]>([
    'acc-momo',
    'acc-orange',
    'acc-bank',
  ]);
  const [startingBalance, setStartingBalance] = useState('845000');
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([
    'Food & Supermarket',
    'Transport (Yango / Taxi)',
    'ENEO & CAMWATER Bills',
  ]);

  const handleFinish = () => {
    const totalBal = parseFloat(startingBalance) || 0;
    const activeAccounts = accounts.filter(a => selectedAccs.includes(a.id));
    const toUseAccounts = activeAccounts.length > 0 ? activeAccounts : accounts;
    
    // Distribute balance evenly across selected accounts
    const share = Math.floor(totalBal / toUseAccounts.length);
    const updatedAccounts = toUseAccounts.map((acc, idx) => ({
      ...acc,
      balance: idx === 0 ? share + (totalBal - share * toUseAccounts.length) : share,
    }));

    const activeBudgets = budgets.filter(b => selectedBudgets.includes(b.name));
    const toUseBudgets = activeBudgets.length > 0 ? activeBudgets : budgets;

    applySetupConfiguration({
      accounts: updatedAccounts,
      budgets: toUseBudgets,
      savingsGoals,
    });

    triggerConfetti();
    setScreen('main');
  };

  return (
    <div className="min-h-screen w-full bg-[#080b12] flex flex-col justify-between p-6 text-white">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
            FN
          </div>
          <span className="text-sm font-bold tracking-tight">{t('setup_title')}</span>
        </div>
        <span className="text-xs font-semibold text-emerald-400">
          Step {step} of 3
        </span>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full my-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold mb-2">{t('setup_step_1')}</h2>
              <p className="text-xs text-gray-400 mb-6">
                Pick the wallets and accounts you use for everyday finances in Cameroon.
              </p>

              <div className="space-y-3 mb-8">
                {accounts.map(acc => {
                  const active = selectedAccs.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        if (active) {
                          setSelectedAccs(prev => prev.filter(i => i !== acc.id));
                        } else {
                          setSelectedAccs(prev => [...prev, acc.id]);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        active
                          ? 'bg-white/10 border-emerald-500 shadow-md'
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${acc.color} flex items-center justify-center text-white font-bold`}>
                          {acc.type === 'momo' || acc.type === 'orange_money' ? (
                            <Smartphone className="w-5 h-5" />
                          ) : acc.type === 'bank' ? (
                            <Building2 className="w-5 h-5" />
                          ) : (
                            <Wallet className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-bold block">{acc.name}</span>
                          <span className="text-xs text-gray-400">{acc.accountNumber || 'Wallet'}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        active ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                      }`}>
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold mb-2">{t('setup_step_2')}</h2>
              <p className="text-xs text-gray-400 mb-6">
                Enter your approximate total liquid savings in Central African Francs (XAF).
              </p>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center mb-8">
                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                  Total Liquid Starting Balance
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="number"
                    value={startingBalance}
                    onChange={e => setStartingBalance(e.target.value)}
                    className="w-48 bg-transparent text-center text-3xl font-extrabold font-mono text-white focus:outline-none"
                  />
                  <span className="text-lg font-bold text-emerald-400">XAF</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold mb-2">{t('setup_step_3')}</h2>
              <p className="text-xs text-gray-400 mb-6">
                We set up automated alert thresholds for your highest-impact categories.
              </p>

              <div className="grid grid-cols-1 gap-2.5 mb-8">
                {[
                  'Food & Supermarket',
                  'Transport (Yango / Taxi)',
                  'ENEO & CAMWATER Bills',
                  'MTN & Orange Data / Airtime',
                  'Njangi / Tontine Dues',
                ].map((cat, idx) => {
                  const active = selectedBudgets.includes(cat);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (active) {
                          setSelectedBudgets(prev => prev.filter(c => c !== cat));
                        } else {
                          setSelectedBudgets(prev => [...prev, cat]);
                        }
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        active
                          ? 'bg-white/10 border-emerald-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-xs font-semibold">{cat}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        active ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                      }`}>
                        {active && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="max-w-md mx-auto w-full flex space-x-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-1/3 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300"
          >
            {t('back')}
          </button>
        )}
        <button
          onClick={() => {
            if (step < 3) setStep(step + 1);
            else handleFinish();
          }}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
        >
          <span>{step === 3 ? t('finish_setup') : t('next')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
