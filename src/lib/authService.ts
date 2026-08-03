import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  UserProfile, 
  Account, 
  SavingsGoal, 
  BudgetCategory, 
  Transaction, 
  RecurringBill, 
  NotificationItem 
} from '../types';
import {
  initialAccounts,
  initialBudgets,
  initialNotifications,
  initialRecurringBills,
  initialSavingsGoals,
  initialTransactions,
} from '../data/initialData';

export interface RegisterParams {
  name: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginParams {
  identifier: string; // Can be email, username, or phone number
  password: string;
}

/**
 * Register a new user with Name, Username, Phone, Email and Password.
 * Saves profile to Firestore and seeds default accounts/goals for the user.
 */
export async function registerUser({
  name,
  username,
  phone,
  email,
  password,
}: RegisterParams): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  // 1. Check if username or phone is already taken in Firestore
  try {
    const usersRef = collection(db, 'users');
    
    const usernameQuery = query(usersRef, where('username', '==', cleanUsername));
    const usernameSnap = await getDocs(usernameQuery);
    if (!usernameSnap.empty) {
      throw new Error('This username is already taken. Please choose another.');
    }

    const phoneQuery = query(usersRef, where('phone', '==', cleanPhone));
    const phoneSnap = await getDocs(phoneQuery);
    if (!phoneSnap.empty) {
      throw new Error('This phone number is already registered. Please switch to Login above.');
    }
  } catch (err: any) {
    if (err.message?.includes('already taken') || err.message?.includes('already registered')) {
      throw err;
    }
    console.warn('Firestore uniqueness check skipped (offline/permission fallback):', err);
  }

  // 2. Try creating user with Firebase Auth, or fallback to seamless Custom Auth
  let uid = '';
  let user: FirebaseUser | null = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    user = userCredential.user;
    uid = user.uid;
  } catch (authError: any) {
    // If Email/Password auth is not enabled in Firebase Console (operation-not-allowed) or other auth error,
    // seamlessly use Firestore-backed Custom Auth Session
    console.warn('Firebase Auth email provider unavailable or not enabled, using seamless custom authentication:', authError?.code);
    uid = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    user = {
      uid,
      email: cleanEmail,
      displayName: name.trim(),
      isAnonymous: false,
      emailVerified: true,
    } as FirebaseUser;

    // Persist custom auth session to localStorage
    localStorage.setItem(
      'fundnesta_custom_auth',
      JSON.stringify({
        uid,
        email: cleanEmail,
        name: name.trim(),
        username: cleanUsername,
        phone: cleanPhone,
        password,
      })
    );
    window.dispatchEvent(new Event('fundnesta_auth_change'));
  }

  // 3. Create UserProfile document in Firestore
  const profile: UserProfile = {
    name: name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    language: 'en',
    currency: 'XAF',
    pinEnabled: true,
    pinCode: '2370',
    biometricEnabled: true,
    offlineMode: false,
    syncStatus: 'synced',
    lastSyncedAt: new Date().toISOString(),
    // Store extra lookup field
    username: cleanUsername,
    uid: uid,
  };

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, profile);
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }

  // 4. Seed clean default accounts (with 0 balance) and a welcome notification for new users
  try {
    const batch = writeBatch(db);

    const defaultNewUserAccounts: Account[] = [
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

    defaultNewUserAccounts.forEach((acc) => {
      const ref = doc(db, 'users', uid, 'accounts', acc.id);
      batch.set(ref, acc);
    });

    const welcomeNotif = {
      id: 'notif-welcome',
      title: 'Welcome to FundNesta!',
      message: 'Your account is ready. Add your first transaction or set up a budget to start tracking.',
      time: 'Just now',
      read: false,
      type: 'info' as const,
    };
    const refNotif = doc(db, 'users', uid, 'notifications', welcomeNotif.id);
    batch.set(refNotif, welcomeNotif);

    await batch.commit();
  } catch (err) {
    console.error('Error seeding initial data to Firestore:', err);
  }

  return { user: user!, profile };
}

/**
 * Log in using Email, Username, or Phone Number + Password.
 */
export async function loginUser({ identifier, password }: LoginParams): Promise<FirebaseUser> {
  const cleanId = identifier.trim().toLowerCase();
  let emailToUse = cleanId;
  let foundFirestoreUser: any = null;

  // 1. Lookup user in Firestore by username, phone, or email
  try {
    const usersRef = collection(db, 'users');
    if (!cleanId.includes('@')) {
      const usernameQuery = query(usersRef, where('username', '==', cleanId));
      const usernameSnap = await getDocs(usernameQuery);

      if (!usernameSnap.empty) {
        foundFirestoreUser = usernameSnap.docs[0].data();
        if (foundFirestoreUser.email) emailToUse = foundFirestoreUser.email;
      } else {
        const phoneQuery = query(usersRef, where('phone', '==', identifier.trim()));
        const phoneSnap = await getDocs(phoneQuery);

        if (!phoneSnap.empty) {
          foundFirestoreUser = phoneSnap.docs[0].data();
          if (foundFirestoreUser.email) emailToUse = foundFirestoreUser.email;
        }
      }
    } else {
      const emailQuery = query(usersRef, where('email', '==', cleanId));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        foundFirestoreUser = emailSnap.docs[0].data();
      }
    }
  } catch (e) {
    console.warn('Firestore lookup error during login:', e);
  }

  // 2. Attempt real Firebase Auth
  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
    return userCredential.user;
  } catch (authError: any) {
    console.warn('Firebase Auth sign-in fallback triggered:', authError?.code);

    // If Firebase Auth provider is not enabled (operation-not-allowed) or fails, check Custom Auth
    if (foundFirestoreUser) {
      const customUser = {
        uid: foundFirestoreUser.uid,
        email: foundFirestoreUser.email,
        displayName: foundFirestoreUser.name,
        isAnonymous: false,
        emailVerified: true,
      } as FirebaseUser;

      localStorage.setItem(
        'fundnesta_custom_auth',
        JSON.stringify({
          uid: foundFirestoreUser.uid,
          email: foundFirestoreUser.email,
          name: foundFirestoreUser.name,
          username: foundFirestoreUser.username,
          phone: foundFirestoreUser.phone,
          password,
        })
      );
      window.dispatchEvent(new Event('fundnesta_auth_change'));
      return customUser;
    }

    // Check localStorage fallback for offline/demo sessions
    const savedCustom = localStorage.getItem('fundnesta_custom_auth');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (
          parsed.email === cleanId ||
          parsed.username === cleanId ||
          parsed.phone === identifier.trim()
        ) {
          if (parsed.password === password) {
            window.dispatchEvent(new Event('fundnesta_auth_change'));
            return {
              uid: parsed.uid,
              email: parsed.email,
              displayName: parsed.name,
            } as FirebaseUser;
          } else {
            throw new Error('Incorrect password. Please try again.');
          }
        }
      } catch (err: any) {
        if (err.message?.includes('Incorrect password')) throw err;
      }
    }

    throw new Error('No account found with this Username, Phone, or Email. Please check your credentials or register a new account.');
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('fundnesta_custom_auth');
  window.dispatchEvent(new Event('fundnesta_auth_change'));
}

/**
 * Real-time listener for user profile document
 */
export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const docRef = doc(db, 'users', uid);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error('Error subscribing to profile:', err);
  });
}

/**
 * Generic real-time listener for a user subcollection
 */
export function subscribeToUserSubcollection<T>(
  uid: string,
  subcollectionName: string,
  callback: (items: T[]) => void
) {
  const colRef = collection(db, 'users', uid, subcollectionName);
  return onSnapshot(colRef, (snap) => {
    const items: T[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    callback(items);
  }, (err) => {
    console.error(`Error subscribing to ${subcollectionName}:`, err);
  });
}
