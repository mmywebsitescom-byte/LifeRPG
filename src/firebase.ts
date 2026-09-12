import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFRT6oONsBLm25ZDqbETBU4ZFyAu1hRNE",
  authDomain: "teachersday-1e00c.firebaseapp.com",
  projectId: "teachersday-1e00c",
  storageBucket: "teachersday-1e00c.firebasestorage.app",
  messagingSenderId: "606014188068",
  appId: "1:606014188068:web:659d3608ba21e52998c6b1"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
export type { FirebaseUser };
