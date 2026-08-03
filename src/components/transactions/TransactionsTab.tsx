import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Target,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { TransactionType } from '../../types';

export const TransactionsTab: React.FC = () => {
  const {
    t,
    language,
    transactions,
    accounts,
    deleteTransaction,
    formatMoney,
    setIsAddSheetOpen,
    confirmAction,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleDeleteTransaction = (tx: any) => {
    confirmAction({
      title: language === 'fr' ? 'Supprimer l’opération' : 'Delete Transaction',
      description:
        language === 'fr'
          ? `Êtes-vous sûr de vouloir supprimer cette opération (${tx.category}) de ${formatMoney(tx.amount)} ? Cette action est irréversible.`
          : `Are you sure you want to delete this ${tx.category} transaction of ${formatMoney(tx.amount)}? This action cannot be undone.`,
      variant: 'danger',
      confirmLabel: language === 'fr' ? 'Oui, supprimer' : 'Yes, Delete',
      onConfirm: () => {
        deleteTransaction(tx.id);
      },
    });
  };

  const filteredTxs = transactions.filter(tx => {
    const matchesSearch =
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTxIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return TrendingUp;
      case 'goal_deposit':
        return Target;
      case 'transfer':
        return ArrowRightLeft;
      case 'njangi':
        return Users;
      default:
        return TrendingDown;
    }
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* Search & Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          onClick={() => setIsAddSheetOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_transaction')}</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: t('all') },
          { id: 'expense', label: t('expense') },
          { id: 'income', label: t('income') },
          { id: 'goal_deposit', label: t('goal_deposit') },
          { id: 'njangi', label: t('njangi') },
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === chip.id
                ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 border-emerald-400 text-white shadow'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTxs.length === 0 ? (
        <GlassCard className="p-10 text-center text-gray-400 text-xs">
          {t('no_recent_transactions')}
        </GlassCard>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredTxs.map(tx => {
              const IconComp = getTxIcon(tx.type);
              const isIncome = tx.type === 'income';
              const isGoal = tx.type === 'goal_deposit';
              const isNjangi = tx.type === 'njangi';
              const acc = accounts.find(a => a.id === tx.accountId);

              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard className="p-4 flex items-center justify-between group">
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white ${
                          isIncome
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : isGoal
                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                            : isNjangi
                            ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400'
                            : 'bg-white/5 border border-white/10 text-gray-300'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white block">
                          {tx.note || tx.category}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                          {acc && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400/90 font-medium">{acc.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isIncome
                            ? 'text-emerald-400'
                            : isGoal
                            ? 'text-cyan-400'
                            : isNjangi
                            ? 'text-purple-400'
                            : 'text-white'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                      </span>

                      {/* Delete action */}
                      <button
                        onClick={() => handleDeleteTransaction(tx)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
