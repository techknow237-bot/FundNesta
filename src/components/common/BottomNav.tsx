import React from 'react';
import {
  Home,
  Target,
  PieChart,
  ListOrdered,
  BarChart3,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { mainTab, setMainTab, setIsAddSheetOpen, t } = useApp();

  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: t('home'), icon: Home },
    { id: 'goals', label: t('goals'), icon: Target }, // Centerpiece!
    { id: 'budgets', label: t('budgets'), icon: PieChart },
    { id: 'transactions', label: t('transactions'), icon: ListOrdered },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'more', label: t('more'), icon: MoreHorizontal },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f17]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="max-w-4xl mx-auto px-1.5 sm:px-2 pb-1.5 pt-2 flex items-center justify-around relative">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = mainTab === item.id;

          // Insert the glowing floating "+" FAB button after the 3rd item
          const showFabAfter = index === 2;

          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setMainTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all min-w-[42px] ${
                  isActive
                    ? 'text-emerald-400 scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] mt-1 font-medium truncate max-w-[48px] sm:max-w-none ${isActive ? 'text-emerald-400 font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>

              {showFabAfter && (
                <div className="flex flex-col items-center justify-center -mt-5 px-0.5">
                  <button
                    onClick={() => setIsAddSheetOpen(true)}
                    className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-95 transition-all"
                    title={t('add_transaction')}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-90 transition-transform duration-300" />
                    <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur transition-opacity" />
                  </button>
                  <span className="text-[9px] sm:text-[10px] mt-1 font-medium text-gray-300">{t('add_transaction')}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
