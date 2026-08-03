import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { subscribeToUserProfile, subscribeToUserSubcollection } from '../lib/authService';
import {
  Account,
  BudgetCategory,
  Currency,
  Language,
  MainTab,
  NjangiGroup,
  NotificationItem,
  RecurringBill,
  SavingsGoal,
  ScreenState,
  Transaction,
  TransactionType,
  UserProfile,
} from '../types';
import {
  initialAccounts,
  initialBudgets,
  initialNjangiGroup,
  initialNotifications,
  initialProfile,
  initialRecurringBills,
  initialSavingsGoals,
  initialTransactions,
} from '../data/initialData';
import { translations } from '../i18n/translations';

export interface ConfirmModalOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
  onConfirm: () => void;
}

interface AppContextType {
  // Firebase Auth State
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  applySetupConfiguration: (config: {
    accounts: Account[];
    budgets: BudgetCategory[];
    savingsGoals: SavingsGoal[];
    language?: Language;
    currency?: Currency;
  }) => void;

  // Screen & Tab State
  screen: ScreenState;
  setScreen: (screen: ScreenState) => void;
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;

  // Language & Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Currency & formatting
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatMoney: (amountInXaf: number) => string;

  // Data
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  depositToGoal: (goalId: string, sourceAccountId: string, amount: number, note?: string) => void;

  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id'>) => void;
  updateBudget: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudget: (id: string) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  njangiGroup: NjangiGroup | null;
  recordNjangiContribution: (amount: number, accountId: string) => void;

  recurringBills: RecurringBill[];
  payBill: (billId: string, accountId: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals & Sheets
  isAddSheetOpen: boolean;
  setIsAddSheetOpen: (open: boolean) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  confirmModalState: ConfirmModalOptions | null;
  confirmAction: (options: ConfirmModalOptions) => void;
  closeConfirmModal: () => void;
  
  // Theme & Effects
  triggerConfetti: () => void;
  syncNow: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface OfflineSyncItem {
  id: string;
  subcollection: string;
  docId: string;
  data: any;
  action: 'set' | 'delete';
  timestamp: number;
}

const STORAGE_KEY = 'fundnesta_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [screen, setScreen] = useState<ScreenState>('splash');
  const [mainTab, setMainTab] = useState<MainTab>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialBudgets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [njangiGroup, setNjangiGroup] = useState<NjangiGroup | null>(initialNjangiGroup);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(initialRecurringBills);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalOptions | null>(null);

  const confirmAction = useCallback((options: ConfirmModalOptions) => {
    setConfirmModalState(options);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalState(null);
  }, []);

  // Helper to recursively remove undefined properties before saving to Firestore
  const sanitizeForFirestore = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned;
  };

  // Offline queuing helper
  const enqueueOfflineSync = (item: Omit<OfflineSyncItem, 'id' | 'timestamp'>) => {
    try {
      const queueRaw = localStorage.getItem('fundnesta_offline_sync_queue');
      const queue: OfflineSyncItem[] = queueRaw ? JSON.parse(queueRaw) : [];
      const filtered = queue.filter(
        q => !(q.subcollection === item.subcollection && q.docId === item.docId)
      );
      filtered.push({
        ...item,
        id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
      });
      localStorage.setItem('fundnesta_offline_sync_queue', JSON.stringify(filtered));
      setProfile(prev => ({
        ...prev,
        syncStatus: 'offline',
        offlineMode: true,
      }));
    } catch (e) {
      console.error('Failed to enqueue offline sync item:', e);
    }
  };

  const processOfflineQueue = async () => {
    if (!firebaseUser || !navigator.onLine) return;

    const queueRaw = localStorage.getItem('fundnesta_offline_sync_queue');
    if (!queueRaw) {
      setProfile(prev => ({ ...prev, syncStatus: 'synced', offlineMode: false }));
      return;
    }

    try {
      const queue: OfflineSyncItem[] = JSON.parse(queueRaw);
      if (!queue || queue.length === 0) {
        setProfile(prev => ({ ...prev, syncStatus: 'synced', offlineMode: false }));
        return;
      }

      setProfile(prev => ({ ...prev, syncStatus: 'syncing', offlineMode: false }));
      console.log(`[Online Restored] Syncing ${queue.length} offline changes to Firestore...`);

      const remainingQueue: OfflineSyncItem[] = [];

      for (const item of queue) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid, item.subcollection, item.docId);
          if (item.action === 'delete') {
            await deleteDoc(ref);
          } else {
            await setDoc(ref, sanitizeForFirestore(item.data), { merge: true });
          }
        } catch (err) {
          console.error(`Failed to sync offline item ${item.subcollection}/${item.docId}:`, err);
          remainingQueue.push(item);
        }
      }

      if (remainingQueue.length === 0) {
        localStorage.removeItem('fundnesta_offline_sync_queue');
        setProfile(prev => ({
          ...prev,
          syncStatus: 'synced',
          offlineMode: false,
          lastSyncedAt: new Date().toISOString(),
        }));
        console.log('[Online Restored] All offline changes successfully synced to Firestore!');
      } else {
        localStorage.setItem('fundnesta_offline_sync_queue', JSON.stringify(remainingQueue));
        setProfile(prev => ({
          ...prev,
          syncStatus: 'offline',
          offlineMode: true,
        }));
      }
    } catch (e) {
      console.error('Error processing offline queue:', e);
    }
  };

  // Helper to sync single document to Firestore if logged in
  const syncDocToFirestore = (subcollection: string, docId: string, data: any) => {
    if (!firebaseUser) return;
    const sanitized = sanitizeForFirestore(data);

    if (!navigator.onLine) {
      console.log(`[Offline Mode] Queued save for ${subcollection}/${docId} to local storage.`);
      enqueueOfflineSync({
        subcollection,
        docId,
        data: sanitized,
        action: 'set',
      });
      return;
    }

    const ref = doc(db, 'users', firebaseUser.uid, subcollection, docId);
    setDoc(ref, sanitized, { merge: true })
      .then(() => {
        setProfile(prev => {
          if (prev.syncStatus !== 'synced') {
            return {
              ...prev,
              syncStatus: 'synced',
              offlineMode: false,
              lastSyncedAt: new Date().toISOString(),
            };
          }
          return prev;
        });
      })
      .catch(err => {
        console.warn(`Error syncing ${subcollection}/${docId} to Firestore. Queuing offline:`, err);
        enqueueOfflineSync({
          subcollection,
          docId,
          data: sanitized,
          action: 'set',
        });
      });
  };

  const removeDocFromFirestore = (subcollection: string, docId: string) => {
    if (!firebaseUser) return;
    if (!navigator.onLine) {
      enqueueOfflineSync({
        subcollection,
        docId,
        data: null,
        action: 'delete',
      });
      return;
    }
    const ref = doc(db, 'users', firebaseUser.uid, subcollection, docId);
    deleteDoc(ref).catch(err => {
      console.warn(`Error deleting ${subcollection}/${docId} from Firestore. Queuing offline:`, err);
      enqueueOfflineSync({
        subcollection,
        docId,
        data: null,
        action: 'delete',
      });
    });
  };

  // Listen for online/offline events to automatically sync when internet connection is restored
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Internet connection restored. Triggering offline queue sync...');
      setProfile(prev => ({ ...prev, offlineMode: false, syncStatus: 'syncing' }));
      processOfflineQueue();
    };

    const handleOffline = () => {
      console.log('[Network] Device went offline. Local storage offline mode active.');
      setProfile(prev => ({ ...prev, offlineMode: true, syncStatus: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setProfile(prev => ({ ...prev, offlineMode: true, syncStatus: 'offline' }));
    } else if (firebaseUser) {
      processOfflineQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [firebaseUser]);

  // 1. Firebase Auth listener & Real-time Firestore subscriptions with Custom Auth fallback
  useEffect(() => {
    const checkCustomAuth = () => {
      const customAuth = localStorage.getItem('fundnesta_custom_auth');
      if (customAuth) {
        try {
          const parsed = JSON.parse(customAuth);
          if (parsed && parsed.uid) {
            setFirebaseUser({
              uid: parsed.uid,
              email: parsed.email,
              displayName: parsed.name,
              isAnonymous: false,
              emailVerified: true,
            } as any);
            setAuthLoading(false);
            return true;
          }
        } catch (e) {
          // ignore
        }
      }
      return false;
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setAuthLoading(false);
      } else {
        const hasCustom = checkCustomAuth();
        if (!hasCustom) {
          setFirebaseUser(null);
          setAuthLoading(false);
        }
      }
    });

    const handleAuthChange = () => {
      if (!auth.currentUser) {
        const hasCustom = checkCustomAuth();
        if (!hasCustom) {
          setFirebaseUser(null);
        }
      }
    };

    window.addEventListener('fundnesta_auth_change', handleAuthChange);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('fundnesta_auth_change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;

    // Load from local storage immediately so offline mode works seamlessly
    try {
      const userKey = `${STORAGE_KEY}_${firebaseUser.uid}`;
      const savedUser = localStorage.getItem(userKey) || localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.profile) setProfile(prev => ({ ...prev, ...parsed.profile }));
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.njangiGroup) setNjangiGroup(parsed.njangiGroup);
        if (parsed.recurringBills) setRecurringBills(parsed.recurringBills);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch (err) {
      console.error('Failed to load user local storage fallback:', err);
    }

    // Real-time listener for user profile
    const unsubProfile = subscribeToUserProfile(firebaseUser.uid, (remoteProfile) => {
      if (remoteProfile) {
        setProfile(remoteProfile);
      }
    });

    const unsubAccounts = subscribeToUserSubcollection<Account>(firebaseUser.uid, 'accounts', (items) => {
      if (items && items.length > 0) {
        setAccounts(items);
      } else if (items && items.length === 0) {
        setAccounts([
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
        ]);
      }
    });

    const unsubGoals = subscribeToUserSubcollection<SavingsGoal>(firebaseUser.uid, 'savingsGoals', (items) => {
      if (items) setSavingsGoals(items);
    });

    const unsubBudgets = subscribeToUserSubcollection<BudgetCategory>(firebaseUser.uid, 'budgets', (items) => {
      if (items) setBudgets(items);
    });

    const unsubTransactions = subscribeToUserSubcollection<Transaction>(firebaseUser.uid, 'transactions', (items) => {
      if (items) {
        items.sort((a, b) => (a.date < b.date ? 1 : -1));
        setTransactions(items);
      }
    });

    const unsubBills = subscribeToUserSubcollection<RecurringBill>(firebaseUser.uid, 'recurringBills', (items) => {
      if (items) setRecurringBills(items);
    });

    const unsubNotifs = subscribeToUserSubcollection<NotificationItem>(firebaseUser.uid, 'notifications', (items) => {
      if (items) setNotifications(items);
    });

    return () => {
      unsubProfile();
      unsubAccounts();
      unsubGoals();
      unsubBudgets();
      unsubTransactions();
      unsubBills();
      unsubNotifs();
    };
  }, [firebaseUser]);

  // Load from localStorage on mount (for offline/guest fallback)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !firebaseUser) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.njangiGroup) setNjangiGroup(parsed.njangiGroup);
        if (parsed.recurringBills) setRecurringBills(parsed.recurringBills);
        if (parsed.notifications) setNotifications(parsed.notifications);
      } catch (err) {
        console.error('Failed to load FundNesta data from localStorage', err);
      }
    }
  }, [firebaseUser]);

  // Save to localStorage whenever state changes (both generic key and user-scoped key)
  useEffect(() => {
    try {
      const dataToSave = {
        profile,
        accounts,
        savingsGoals,
        budgets,
        transactions,
        njangiGroup,
        recurringBills,
        notifications,
      };
      const serialized = JSON.stringify(dataToSave);
      localStorage.setItem(STORAGE_KEY, serialized);
      if (firebaseUser?.uid) {
        localStorage.setItem(`${STORAGE_KEY}_${firebaseUser.uid}`, serialized);
      }
    } catch (err) {
      console.error('Failed to save FundNesta data to localStorage', err);
    }
  }, [profile, accounts, savingsGoals, budgets, transactions, njangiGroup, recurringBills, notifications, firebaseUser]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('fundnesta_custom_auth');
    window.dispatchEvent(new Event('fundnesta_auth_change'));
    setFirebaseUser(null);
    setProfile(initialProfile);
    setAccounts(initialAccounts);
    setSavingsGoals(initialSavingsGoals);
    setBudgets(initialBudgets);
    setTransactions(initialTransactions);
    setRecurringBills(initialRecurringBills);
    setNotifications(initialNotifications);
    setScreen('splash');
  };

  const language = profile.language;
  const setLanguage = (lang: Language) => {
    setProfile(prev => ({ ...prev, language: lang }));
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || key;
  };

  const currency = profile.currency;
  const setCurrency = (curr: Currency) => {
    setProfile(prev => ({ ...prev, currency: curr }));
  };

  // Format amount in XAF (no decimals, comma separation) or converted EUR / USD
  const formatMoney = (amountInXaf: number): string => {
    const rounded = Math.round(amountInXaf);
    if (currency === 'EUR') {
      // Approximate 1 EUR = 655.957 XAF
      const inEur = (rounded / 655.957).toFixed(2);
      return `€${Number(inEur).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}`;
    }
    if (currency === 'USD') {
      // Approximate 1 USD = 600 XAF
      const inUsd = (rounded / 600).toFixed(2);
      return `$${Number(inUsd).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}`;
    }
    // Default XAF / FCFA
    const formatted = Math.abs(rounded).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US');
    const sign = rounded < 0 ? '-' : '';
    return `${sign}${formatted} XAF`;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch (e) {
      // Ignore if canvas not ready
    }
  };

  const syncNow = async () => {
    if (!navigator.onLine) {
      alert('Device is currently offline. Your data is safely stored in local storage and will automatically sync when internet connection is restored.');
      return;
    }
    setProfile(prev => ({ ...prev, syncStatus: 'syncing' }));
    if (firebaseUser) {
      await processOfflineQueue();
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), sanitizeForFirestore(profile), { merge: true });
        transactions.forEach(tx => syncDocToFirestore('transactions', tx.id, tx));
        accounts.forEach(acc => syncDocToFirestore('accounts', acc.id, acc));
        savingsGoals.forEach(sg => syncDocToFirestore('savingsGoals', sg.id, sg));
        budgets.forEach(b => syncDocToFirestore('budgets', b.id, b));
        recurringBills.forEach(rb => syncDocToFirestore('recurringBills', rb.id, rb));
        if (njangiGroup) {
          syncDocToFirestore('njangiGroup', njangiGroup.id, njangiGroup);
        }
      } catch (e) {
        console.error('Error during full syncNow:', e);
      }
    }
    setProfile(prev => ({
      ...prev,
      syncStatus: 'synced',
      offlineMode: false,
      lastSyncedAt: new Date().toISOString(),
    }));
  };

  const resetDemoData = () => {
    setProfile(initialProfile);
    setAccounts(initialAccounts);
    setSavingsGoals(initialSavingsGoals);
    setBudgets(initialBudgets);
    setTransactions(initialTransactions);
    setNjangiGroup(initialNjangiGroup);
    setRecurringBills(initialRecurringBills);
    setNotifications(initialNotifications);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), sanitizeForFirestore(next), { merge: true }).catch(err =>
          console.error('Error syncing profile:', err)
        );
      }
      return next;
    });
  };

  // Accounts
  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...acc,
      id: `acc-${Date.now()}`,
    };
    setAccounts(prev => [...prev, newAcc]);
    syncDocToFirestore('accounts', newAcc.id, newAcc);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev =>
      prev.map(a => {
        if (a.id === id) {
          const next = { ...a, ...updates };
          syncDocToFirestore('accounts', id, next);
          return next;
        }
        return a;
      })
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    removeDocFromFirestore('accounts', id);
  };

  // Savings Goals (Core Feature)
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setSavingsGoals(prev => [newGoal, ...prev]);
    syncDocToFirestore('savingsGoals', newGoal.id, newGoal);
    triggerConfetti();
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const next = { ...g, ...updates };
          syncDocToFirestore('savingsGoals', id, next);
          return next;
        }
        return g;
      })
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
    removeDocFromFirestore('savingsGoals', id);
  };

  const depositToGoal = (goalId: string, sourceAccountId: string, amount: number, note?: string) => {
    // 1. Subtract from account
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === sourceAccountId) {
          const nextAcc = { ...acc, balance: Math.max(0, acc.balance - amount) };
          syncDocToFirestore('accounts', acc.id, nextAcc);
          return nextAcc;
        }
        return acc;
      })
    );

    // 2. Add to goal
    let milestoneReached = false;
    let isCompleted = false;
    let goalName = '';

    setSavingsGoals(prev =>
      prev.map(goal => {
        if (goal.id === goalId) {
          goalName = language === 'fr' ? goal.titleFr || goal.title : goal.title;
          const prevPercentage = (goal.currentAmount / goal.targetAmount) * 100;
          const newAmount = goal.currentAmount + amount;
          const newPercentage = (newAmount / goal.targetAmount) * 100;

          if (prevPercentage < 100 && newPercentage >= 100) {
            isCompleted = true;
          } else if (
            (prevPercentage < 25 && newPercentage >= 25) ||
            (prevPercentage < 50 && newPercentage >= 50) ||
            (prevPercentage < 75 && newPercentage >= 75)
          ) {
            milestoneReached = true;
          }

          const nextGoal = { ...goal, currentAmount: newAmount };
          syncDocToFirestore('savingsGoals', goal.id, nextGoal);
          return nextGoal;
        }
        return goal;
      })
    );

    // 3. Record transaction
    const newTx: Transaction = {
      id: `tx-goal-${Date.now()}`,
      type: 'goal_deposit',
      amount,
      category: 'Savings Goals',
      accountId: sourceAccountId,
      toGoalId: goalId,
      note: note || `Deposit to ${goalName}`,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTx, ...prev]);
    syncDocToFirestore('transactions', newTx.id, newTx);

    // 4. Trigger celebration
    if (isCompleted || milestoneReached) {
      triggerConfetti();
      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: isCompleted ? '🎉 Goal Completed!' : '🌟 Milestone Hit!',
        titleFr: isCompleted ? '🎉 Objectif Atteint !' : '🌟 Jalon Atteint !',
        message: `You deposited ${formatMoney(amount)} into "${goalName}". Keep up the great work!`,
        messageFr: `Vous avez déposé ${formatMoney(amount)} pour "${goalName}". Félicitations !`,
        date: 'Just now',
        read: false,
        type: 'goal_milestone',
        targetScreen: 'goals',
      };
      setNotifications(prev => [notifItem, ...prev]);
      syncDocToFirestore('notifications', notifItem.id, notifItem);
    }
  };

  // Budgets
  const addBudget = (budget: Omit<BudgetCategory, 'id'>) => {
    const newBudget: BudgetCategory = {
      ...budget,
      id: `bud-${Date.now()}`,
    };
    setBudgets(prev => [...prev, newBudget]);
    syncDocToFirestore('budgets', newBudget.id, newBudget);
  };

  const updateBudget = (id: string, updates: Partial<BudgetCategory>) => {
    setBudgets(prev =>
      prev.map(b => {
        if (b.id === id) {
          const next = { ...b, ...updates };
          syncDocToFirestore('budgets', id, next);
          return next;
        }
        return b;
      })
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    removeDocFromFirestore('budgets', id);
  };

  // Transactions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions(prev => [newTx, ...prev]);
    syncDocToFirestore('transactions', newTx.id, newTx);

    // Apply amount to account
    if (tx.type === 'expense' || tx.type === 'njangi') {
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === tx.accountId) {
            const nextAcc = { ...acc, balance: acc.balance - tx.amount };
            syncDocToFirestore('accounts', acc.id, nextAcc);
            return nextAcc;
          }
          return acc;
        })
      );
      // Update budget spent if category matches
      setBudgets(prev =>
        prev.map(bud => {
          if (bud.name === tx.category || bud.nameFr === tx.category) {
            const nextBud = { ...bud, spent: bud.spent + tx.amount };
            syncDocToFirestore('budgets', bud.id, nextBud);
            return nextBud;
          }
          return bud;
        })
      );
    } else if (tx.type === 'income') {
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === tx.accountId) {
            const nextAcc = { ...acc, balance: acc.balance + tx.amount };
            syncDocToFirestore('accounts', acc.id, nextAcc);
            return nextAcc;
          }
          return acc;
        })
      );
    } else if (tx.type === 'transfer' && tx.toAccountId) {
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === tx.accountId) {
            const nextAcc = { ...acc, balance: acc.balance - tx.amount };
            syncDocToFirestore('accounts', acc.id, nextAcc);
            return nextAcc;
          }
          if (acc.id === tx.toAccountId) {
            const nextAcc = { ...acc, balance: acc.balance + tx.amount };
            syncDocToFirestore('accounts', acc.id, nextAcc);
            return nextAcc;
          }
          return acc;
        })
      );
    } else if (tx.type === 'goal_deposit' && tx.toGoalId) {
      depositToGoal(tx.toGoalId, tx.accountId, tx.amount, tx.note);
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    removeDocFromFirestore('transactions', id);
  };

  // Njangi
  const recordNjangiContribution = (amount: number, accountId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const nextAcc = { ...acc, balance: Math.max(0, acc.balance - amount) };
          syncDocToFirestore('accounts', acc.id, nextAcc);
          return nextAcc;
        }
        return acc;
      })
    );

    setNjangiGroup(prev => {
      if (!prev) return null;
      const nextGroup = {
        ...prev,
        myTotalContributed: prev.myTotalContributed + amount,
      };
      syncDocToFirestore('njangiGroup', nextGroup.id, nextGroup);
      return nextGroup;
    });

    const newTx: Transaction = {
      id: `tx-njangi-${Date.now()}`,
      type: 'njangi',
      amount,
      category: 'Njangi / Tontine Dues',
      accountId,
      note: njangiGroup ? `Contribution to ${njangiGroup.name}` : 'Njangi Contribution',
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTx, ...prev]);
    syncDocToFirestore('transactions', newTx.id, newTx);
    triggerConfetti();
  };

  // Recurring Bills
  const payBill = (billId: string, accountId: string) => {
    const bill = recurringBills.find(b => b.id === billId);
    if (!bill) return;

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const nextAcc = { ...acc, balance: Math.max(0, acc.balance - bill.amount) };
          syncDocToFirestore('accounts', acc.id, nextAcc);
          return nextAcc;
        }
        return acc;
      })
    );

    const newTx: Transaction = {
      id: `tx-bill-${Date.now()}`,
      type: 'expense',
      amount: bill.amount,
      category: bill.category,
      accountId,
      note: `Paid ${bill.title} (${bill.provider})`,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTx, ...prev]);
    syncDocToFirestore('transactions', newTx.id, newTx);

    // Update bill due date + 1 month
    setRecurringBills(prev =>
      prev.map(b => {
        if (b.id === billId) {
          const nextBill = {
            ...b,
            dueDate: '2026-09-20',
          };
          syncDocToFirestore('recurringBills', b.id, nextBill);
          return nextBill;
        }
        return b;
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id) {
          const next = { ...n, read: true };
          syncDocToFirestore('notifications', id, next);
          return next;
        }
        return n;
      })
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n => {
        const next = { ...n, read: true };
        syncDocToFirestore('notifications', n.id, next);
        return next;
      })
    );
  };

  const applySetupConfiguration = (config: {
    accounts: Account[];
    budgets: BudgetCategory[];
    savingsGoals: SavingsGoal[];
    language?: Language;
    currency?: Currency;
  }) => {
    setAccounts(config.accounts);
    setBudgets(config.budgets);
    setSavingsGoals(config.savingsGoals);
    if (config.language) setLanguage(config.language);
    if (config.currency) setCurrency(config.currency);

    // Persist each configured item to Firestore subcollection if logged in
    if (firebaseUser) {
      config.accounts.forEach(acc => syncDocToFirestore('accounts', acc.id, acc));
      config.budgets.forEach(bud => syncDocToFirestore('budgets', bud.id, bud));
      config.savingsGoals.forEach(goal => syncDocToFirestore('savingsGoals', goal.id, goal));
    }
  };

  return (
    <AppContext.Provider
      value={{
        firebaseUser,
        authLoading,
        logout,
        authMode,
        setAuthMode,
        applySetupConfiguration,
        screen,
        setScreen,
        mainTab,
        setMainTab,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatMoney,
        profile,
        updateProfile,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        depositToGoal,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        transactions,
        addTransaction,
        deleteTransaction,
        njangiGroup,
        recordNjangiContribution,
        recurringBills,
        payBill,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isAddSheetOpen,
        setIsAddSheetOpen,
        isLocked,
        setIsLocked,
        confirmModalState,
        confirmAction,
        closeConfirmModal,
        triggerConfetti,
        syncNow,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
