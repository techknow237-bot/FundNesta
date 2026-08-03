/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingCarousel } from './components/onboarding/OnboardingCarousel';
import { MarketingHome } from './components/marketing/MarketingHome';
import { AuthScreen } from './components/auth/AuthScreen';
import { SetupWizard } from './components/setup/SetupWizard';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { AddTransactionSheet } from './components/common/AddTransactionSheet';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { SavingsGoalsTab } from './components/goals/SavingsGoalsTab';
import { BudgetsTab } from './components/budgets/BudgetsTab';
import { TransactionsTab } from './components/transactions/TransactionsTab';
import { ReportsTab } from './components/reports/ReportsTab';
import { MoreTab } from './components/more/MoreTab';
import { ConfirmationModal } from './components/common/ConfirmationModal';

const GlobalConfirmationModal: React.FC = () => {
  const { confirmModalState, closeConfirmModal } = useApp();
  return (
    <ConfirmationModal
      isOpen={!!confirmModalState}
      options={confirmModalState}
      onClose={closeConfirmModal}
    />
  );
};

const FundNestaAppContent: React.FC = () => {
  const {
    screen,
    authMode,
    mainTab,
    isAddSheetOpen,
    setIsAddSheetOpen,
    isLocked,
    setIsLocked,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // If app is locked by security PIN
  if (isLocked) {
    return <AuthScreen mode="lock" onUnlock={() => setIsLocked(false)} />;
  }

  // Handle Full-Screen flows
  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'onboarding') {
    return <OnboardingCarousel />;
  }

  if (screen === 'marketing') {
    return <MarketingHome />;
  }

  if (screen === 'auth') {
    return <AuthScreen mode={authMode} />;
  }

  if (screen === 'setup_wizard') {
    return <SetupWizard />;
  }

  // Main App Flow with sticky top header and bottom nav
  return (
    <div className="min-h-screen w-full bg-[#080b12] text-white flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Header */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {mainTab === 'dashboard' && <DashboardTab />}
        {mainTab === 'goals' && <SavingsGoalsTab />}
        {mainTab === 'budgets' && <BudgetsTab />}
        {mainTab === 'transactions' && <TransactionsTab />}
        {mainTab === 'reports' && <ReportsTab />}
        {mainTab === 'more' && <MoreTab />}
      </main>

      {/* Persistent Bottom Navigation with Center + FAB */}
      <BottomNav />

      {/* Interactive Bottom Sheet for adding Transactions / Goal Deposits */}
      <AddTransactionSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <FundNestaAppContent />
      <GlobalConfirmationModal />
    </AppProvider>
  );
}

