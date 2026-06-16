import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// ── Your Firebase project (suraksha-33bb4) ────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyDjAzPYsxCK37YzciwSlnWG3FXKb4mt2us',
  authDomain: 'suraksha-33bb4.firebaseapp.com',
  projectId: 'suraksha-33bb4',
  storageBucket: 'suraksha-33bb4.firebasestorage.app',
  messagingSenderId: '50440661956',
  appId: '1:50440661956:web:1dc5bfe2f06ebcd6d09291',
};

const app   = initializeApp(firebaseConfig);
export const fbAuth = getAuth(app);
export const db     = getFirestore(app);

// Re-export Firestore helpers so screens don't import firebase directly
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
};

export function formatFirebaseError(err) {
  const map = {
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/wrong-password':       'Incorrect email or password.',
    'auth/user-not-found':       'No account found with that email.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/too-many-requests':    'Too many attempts. Try again later.',
    'auth/invalid-credential':   'Incorrect email or password.',
  };
  return map[err?.code] || err?.message || 'Something went wrong.';
}
