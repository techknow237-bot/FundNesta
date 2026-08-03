import React, { useState } from 'react';
import {
  Users,
  Wallet,
  Zap,
  Globe,
  Shield,
  RotateCcw,
  CheckCircle2,
  Plus,
  ChevronRight,
  Sparkles,
  Smartphone,
  Building2,
  Lock,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';

export const MoreTab: React.FC = () => {
  const {
    t,
    profile,
    accounts,
    njangiGroup,
    recordNjangiContribution,
    recurringBills,
    payBill,
    formatMoney,
    language,
    setLanguage,
    currency,
    setCurrency,
    setIsLocked,
    resetDemoData,
    firebaseUser,
    logout,
    confirmAction,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'njangi' | 'accounts' | 'bills' | 'settings'>('njangi');

  const handleLockApp = () => {
    confirmAction({
      title: language === 'fr' ? 'Verrouiller l’application' : 'Lock Application',
      description:
        language === 'fr'
          ? 'Voulez-vous verrouiller l’application maintenant ? Vous devrez entrer votre code PIN pour accéder.'
          : 'Do you want to lock the application now? You will need your PIN to unlock.',
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Verrouiller' : 'Lock Now',
      onConfirm: () => setIsLocked(true),
    });
  };

  const handleLogout = () => {
    confirmAction({
      title: language === 'fr' ? 'Déconnexion' : 'Log Out',
      description:
        language === 'fr'
          ? 'Voulez-vous vous déconnecter de votre compte FundNesta ?'
          : 'Are you sure you want to log out of your FundNesta account?',
      variant: 'danger',
      confirmLabel: language === 'fr' ? 'Déconnexion' : 'Log Out',
      onConfirm: async () => {
        await logout();
      },
    });
  };

  const handleRecordNjangi = () => {
    if (!njangiGroup) return;
    confirmAction({
      title: language === 'fr' ? 'Confirmer la cotisation' : 'Confirm Njangi Contribution',
      description:
        language === 'fr'
          ? `Voulez-vous enregistrer votre contribution Tontine de ${formatMoney(njangiGroup.contributionAmount)} ?`
          : `Do you want to record your Njangi contribution of ${formatMoney(njangiGroup.contributionAmount)}?`,
      variant: 'success',
      confirmLabel: language === 'fr' ? 'Confirmer' : 'Confirm Contribution',
      onConfirm: () => {
        recordNjangiContribution(njangiGroup.contributionAmount, 'acc-momo');
      },
    });
  };

  const handlePayBill = (bill: any) => {
    confirmAction({
      title: language === 'fr' ? 'Confirmer le paiement' : 'Confirm Bill Payment',
      description:
        language === 'fr'
          ? `Voulez-vous payer la facture "${bill.title}" d'un montant de ${formatMoney(bill.amount)} ?`
          : `Do you want to pay the bill "${bill.title}" of ${formatMoney(bill.amount)}?`,
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Payer la facture' : 'Pay Bill',
      onConfirm: () => {
        payBill(bill.id, 'acc-orange');
      },
    });
  };

  const handleResetDemo = () => {
    confirmAction({
      title: language === 'fr' ? 'Réinitialiser les données' : 'Reset Demo Data',
      description:
        language === 'fr'
          ? 'Êtes-vous sûr de vouloir réinitialiser toutes les données de démonstration ? Toutes vos modifications locales non sauvegardées seront effacées.'
          : 'Are you sure you want to reset all demo data? Any unsaved local modifications will be cleared.',
      variant: 'danger',
      confirmLabel: language === 'fr' ? 'Réinitialiser' : 'Reset Data',
      onConfirm: () => {
        resetDemoData();
      },
    });
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* User Profile Header */}
      <GlassCard variant="accent" className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">{profile.name}</h2>
              {firebaseUser && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center space-x-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-400 font-mono">
              {profile.username ? `@${profile.username}` : profile.phone} {profile.email ? `• ${profile.email}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLockApp}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors flex items-center space-x-1 text-xs font-semibold"
            title="Lock App"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t('lock_app_now')}</span>
          </button>
          {firebaseUser && (
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-colors flex items-center space-x-1 text-xs font-semibold"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'fr' ? 'Déconnexion' : 'Log Out'}</span>
            </button>
          )}
        </div>
      </GlassCard>

      {/* Section Switcher */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'njangi', label: 'Tontine / Njangi', icon: Users },
          { id: 'accounts', label: language === 'fr' ? 'Comptes' : 'Accounts', icon: Wallet },
          { id: 'bills', label: language === 'fr' ? 'Factures ENEO' : 'ENEO Bills', icon: Zap },
          { id: 'settings', label: language === 'fr' ? 'Paramètres' : 'Settings', icon: Globe },
        ].map(btn => {
          const IconComp = btn.icon;
          const active = activeSection === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveSection(btn.id as any)}
              className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                active
                  ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <IconComp className="w-5 h-5 mb-1" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. NJANGI / TONTINE TRACKER (Cameroon Signature Feature) */}
      {activeSection === 'njangi' && (
        njangiGroup ? (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">{njangiGroup.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                Pot: {formatMoney(njangiGroup.potAmount)}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Monthly contribution of <span className="text-white font-bold">{formatMoney(njangiGroup.contributionAmount)}</span>. Next cycle: <span className="text-emerald-400 font-mono">{njangiGroup.nextContributionDate}</span>.
            </p>

            {/* CIRCULAR AVATAR WHEEL FOR WHOSE TURN IS NEXT */}
            <div className="p-6 rounded-3xl bg-[#0c0f17]/80 border border-white/10 text-center mb-6 relative overflow-hidden">
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                {t('whose_turn_next')}
              </span>

              <div className="text-lg font-extrabold text-emerald-400 mb-6 flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{njangiGroup.currentTurnMemberName}</span>
              </div>

              {/* Avatars circle grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-md mx-auto">
                {njangiGroup.members.map((mem, idx) => (
                  <div key={mem.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-1 border-2 transition-transform ${
                        mem.isCurrentTurn
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 border-amber-300 text-white scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                          : mem.hasReceivedPot
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {mem.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center">
                      {mem.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Record Contribution Action */}
            <button
              onClick={handleRecordNjangi}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {t('record_contribution')} ({formatMoney(njangiGroup.contributionAmount)})
              </span>
            </button>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">No Active Njangi / Tontine Group</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
              You are not currently part of a Njangi group. Join your community or create a group to start saving together.
            </p>
          </GlassCard>
        )
      )}

      {/* 2. ACCOUNTS & WALLETS */}
      {activeSection === 'accounts' && (
        <GlassCard className="p-6">
          <h3 className="text-base font-bold text-white mb-4">{t('accounts_manager')}</h3>
          <div className="space-y-3">
            {accounts.map(acc => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${acc.color} flex items-center justify-center text-white`}>
                    {acc.type === 'momo' || acc.type === 'orange_money' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{acc.name}</h4>
                    <span className="text-xs text-gray-400">{acc.accountNumber || 'Wallet'}</span>
                  </div>
                </div>

                <span className="text-sm font-mono font-extrabold text-emerald-400">
                  {formatMoney(acc.balance)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 3. RECURRING ENEO & CAMWATER BILLS */}
      {activeSection === 'bills' && (
        <GlassCard className="p-6">
          <h3 className="text-base font-bold text-white mb-4">{t('recurring_bills')}</h3>
          <div className="space-y-3">
            {recurringBills.map(bill => (
              <div
                key={bill.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{bill.title}</h4>
                    <span className="text-xs text-gray-400">
                      {language === 'fr' ? 'Échéance :' : 'Due:'} {bill.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-white">
                    {formatMoney(bill.amount)}
                  </span>
                  <button
                    onClick={() => handlePayBill(bill)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
                  >
                    {language === 'fr' ? 'Payer' : 'Pay'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 4. SETTINGS & PREFERENCES */}
      {activeSection === 'settings' && (
        <GlassCard className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Preferred Language / Langue
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['en', 'fr'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                    language === l
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {l === 'en' ? 'English' : 'Français'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Display Currency / Devise
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['XAF', 'EUR', 'USD'] as const).map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                    currency === curr
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {curr === 'XAF' ? 'XAF (FCFA)' : curr}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleResetDemo}
              className="w-full py-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('reset_demo')}</span>
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
