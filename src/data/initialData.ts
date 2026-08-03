import {
  Account,
  BudgetCategory,
  NjangiGroup,
  NotificationItem,
  RecurringBill,
  SavingsGoal,
  Transaction,
  UserProfile,
} from '../types';

export const initialProfile: UserProfile = {
  name: 'Aline Tchamou',
  phone: '+237 679 45 82 10',
  email: 'aline.tchamou@doualatech.cm',
  language: 'en',
  currency: 'XAF',
  pinEnabled: true,
  pinCode: '2370',
  biometricEnabled: true,
  offlineMode: false,
  syncStatus: 'synced',
  lastSyncedAt: new Date().toISOString(),
};

export const initialAccounts: Account[] = [
  {
    id: 'acc-momo',
    name: 'MTN Mobile Money',
    type: 'momo',
    balance: 0,
    accountNumber: '',
    isDefault: true,
    color: 'from-amber-500 to-yellow-600',
    iconName: 'Smartphone',
  },
  {
    id: 'acc-orange',
    name: 'Orange Money',
    type: 'orange_money',
    balance: 0,
    accountNumber: '',
    color: 'from-orange-500 to-red-600',
    iconName: 'Smartphone',
  },
  {
    id: 'acc-bank',
    name: 'Bank Account',
    type: 'bank',
    balance: 0,
    accountNumber: '',
    color: 'from-blue-600 to-indigo-700',
    iconName: 'Building2',
  },
  {
    id: 'acc-cash',
    name: 'Cash Wallet',
    type: 'cash',
    balance: 0,
    color: 'from-emerald-500 to-teal-700',
    iconName: 'Wallet',
  },
];

export const initialSavingsGoals: SavingsGoal[] = [];

export const initialBudgets: BudgetCategory[] = [];

export const initialTransactions: Transaction[] = [];

export const initialNjangiGroup: NjangiGroup | null = null;

export const initialRecurringBills: RecurringBill[] = [];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to FundNesta!',
    titleFr: 'Bienvenue sur FundNesta !',
    message: 'Your account is ready. Add your first transaction, budget, or savings goal to get started.',
    messageFr: 'Votre compte est prêt. Enregistrez votre première transaction, budget ou objectif d’épargne pour commencer.',
    date: 'Just now',
    read: false,
    type: 'info',
  },
];

