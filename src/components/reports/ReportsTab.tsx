import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Download, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';

export const ReportsTab: React.FC = () => {
  const { t, language, transactions, formatMoney, triggerConfetti, confirmAction } = useApp();

  // Category spending aggregation
  const expenseTxs = transactions.filter(
    tx => tx.type === 'expense' || tx.type === 'njangi'
  );

  const categoryTotals: Record<string, number> = {};
  expenseTxs.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value], idx) => ({
    name,
    value,
    color: ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#F43F5E'][idx % 5],
  }));

  const barData = React.useMemo(() => {
    const monthMap: Record<string, { month: string; income: number; expense: number; orderKey: string }> = {};
    const now = new Date();
    // Pre-populate last 4 months so the chart always displays clear month labels
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const orderKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[orderKey] = { month: monthLabel, income: 0, expense: 0, orderKey };
    }

    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (!isNaN(d.getTime())) {
        const orderKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleString('default', { month: 'short' });
        if (!monthMap[orderKey]) {
          monthMap[orderKey] = { month: monthLabel, income: 0, expense: 0, orderKey };
        }
        if (tx.type === 'income') {
          monthMap[orderKey].income += tx.amount;
        } else if (tx.type === 'expense' || tx.type === 'njangi') {
          monthMap[orderKey].expense += tx.amount;
        }
      }
    });

    return Object.values(monthMap)
      .sort((a, b) => a.orderKey.localeCompare(b.orderKey))
      .slice(-4);
  }, [transactions]);

  const handleExport = () => {
    confirmAction({
      title: language === 'fr' ? 'Exporter le relevé' : 'Export Statement',
      description:
        language === 'fr'
          ? 'Voulez-vous générer et télécharger votre relevé financier analytique ?'
          : 'Do you want to generate and download your financial analytics statement?',
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Exporter' : 'Export',
      onConfirm: () => {
        triggerConfetti();
        alert(t('statement_ready'));
      },
    });
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-4xl mx-auto pt-4">
      {/* Top Banner */}
      <GlassCard variant="accent" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              {t('reports_title')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {language === 'fr' ? 'Analyses Financières Cameroun' : 'Cameroon Financial Analytics'}
            </h2>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'fr' ? 'Exporter le relevé' : 'Export Statement'}</span>
          </button>
        </div>
      </GlassCard>

      {/* 1. Spending by Category Donut Chart */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t('spending_by_category')}</span>
        </h3>

        {pieData.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">
            {language === 'fr' ? 'Aucune donnée de dépense disponible.' : 'No expense data available.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatMoney(val)}
                    contentStyle={{
                      backgroundColor: '#141a29',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="space-y-2">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-300 font-medium truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {formatMoney(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 2. Monthly Income vs Expense Bar Chart */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>{t('income_vs_expense')}</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickFormatter={val => `${val / 1000}k`}
              />
              <Tooltip
                formatter={(val: number) => formatMoney(val)}
                contentStyle={{
                  backgroundColor: '#141a29',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
