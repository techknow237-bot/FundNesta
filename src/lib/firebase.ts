import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence, 
  Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "sinuous-osprey-g9v0l",
  appId: "1:146794093430:web:edcffa36e478ea31ec3857",
  apiKey: "AIzaSyCO4lI0eEtPq_QnK8j2SMbmHvTt2EUpwAg",
  authDomain: "sinuous-osprey-g9v0l.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-fundnesta-16dfacbf-e5b1-414d-abdf-d248b04ce05b",
  storageBucket: "sinuous-osprey-g9v0l.firebasestorage.app",
  messagingSenderId: "146794093430",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Try enabling offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore offline persistence failed: multiple tabs open.');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore offline persistence not supported by this browser.');
  } else {
    console.warn('Firestore persistence warning:', err);
  }
});
