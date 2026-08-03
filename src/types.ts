export type Language = 'en' | 'fr';
export type Currency = 'XAF' | 'EUR' | 'USD';

export type AccountType = 'momo' | 'orange_money' | 'bank' | 'cash' | 'savings';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumber?: string;
  isDefault?: boolean;
  color: string;
  iconName: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer' | 'goal_deposit' | 'njangi';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  accountId: string;
  toAccountId?: string;
  toGoalId?: string;
  note: string;
  date: string; // ISO string or YYYY-MM-DD
  isRecurring?: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  receiptUrl?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
  color: string;
  alertThreshold: number; // percentage e.g. 80
}

export interface SavingsGoal {
  id: string;
  title: string;
  titleFr: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
  color: string;
  notes?: string;
}

export interface NjangiMember {
  id: string;
  name: string;
  avatarUrl?: string;
  hasReceivedPot: boolean;
  isCurrentTurn: boolean;
}

export interface NjangiGroup {
  id: string;
  name: string;
  contributionAmount: number; // XAF per cycle
  frequency: 'weekly' | 'monthly';
  totalMembers: number;
  potAmount: number; // contributionAmount * totalMembers
  nextContributionDate: string;
  currentTurnMemberId: string;
  currentTurnMemberName: string;
  isUserTurn: boolean;
  myTotalContributed: number;
  members: NjangiMember[];
}

export interface RecurringBill {
  id: string;
  title: string;
  provider: string; // e.g. ENEO, CAMWATER, Canal+, MTN Fiber, School
  amount: number;
  dueDate: string; // YYYY-MM-DD
  frequency: 'monthly' | 'quarterly' | 'yearly';
  isAutoPay: boolean;
  icon: string;
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleFr: string;
  message: string;
  messageFr: string;
  date: string;
  read: boolean;
  type: 'budget_alert' | 'bill_due' | 'goal_milestone' | 'njangi_turn' | 'sync' | 'info';
  targetScreen?: string;
}

export interface UserProfile {
  uid?: string;
  username?: string;
  name: string;
  phone: string;
  email: string;
  language: Language;
  currency: Currency;
  pinEnabled: boolean;
  pinCode: string;
  biometricEnabled: boolean;
  offlineMode: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: string;
}

export type ScreenState = 
  | 'splash'
  | 'onboarding'
  | 'marketing'
  | 'auth'
  | 'setup_wizard'
  | 'app';

export type MainTab = 'dashboard' | 'goals' | 'budgets' | 'transactions' | 'reports' | 'more';
