import { User } from '../types';
import { dbStore, AUTH_SESSION_KEY } from './store';
import { fetchJson } from './client';
import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  FirebaseUser
} from '../firebase';

// Register/sync Firebase user with Firestore backend
async function syncUserWithBackend(fbUser: FirebaseUser, name?: string, heroClass?: string): Promise<User | null> {
  try {
    const user = await fetchJson<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        uid: fbUser.uid,
        name: name || fbUser.displayName || fbUser.email?.split('@')[0] || 'Hero',
        email: fbUser.email || '',
        avatarUrl: fbUser.photoURL || undefined,
        heroClass,
      }),
    });
    return user;
  } catch (err) {
    console.warn('[authApi] syncUserWithBackend failed:', err);
    return null;
  }
}

export function formatFirebaseAuthError(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = (err.code || '').toLowerCase();
  const msg = err.message || '';

  if (code.includes('unauthorized-domain') || msg.includes('unauthorized-domain')) {
    return 'Domain not authorized in Firebase! In Firebase Console, go to Authentication → Settings → Authorized domains and add your Vercel URL (e.g. your-app.vercel.app).';
  }
  if (code.includes('operation-not-allowed') || msg.includes('operation-not-allowed')) {
    return 'Sign-in method is not enabled in Firebase! Go to Firebase Console → Authentication → Sign-in method and enable Email/Password (or Google).';
  }
  if (code.includes('email-already-in-use') || msg.includes('email-already-in-use')) {
    return 'This email address is already registered. Please sign in with your password.';
  }
  if (code.includes('wrong-password') || code.includes('invalid-credential') || msg.includes('invalid-credential')) {
    return 'Incorrect email address or password. Please verify your credentials.';
  }
  if (code.includes('user-not-found') || msg.includes('user-not-found')) {
    return 'No hero account found with this email. Please forge a new account first!';
  }
  if (code.includes('weak-password') || msg.includes('weak-password')) {
    return 'Passphrase is too weak. Please use at least 6 characters.';
  }
  if (code.includes('invalid-email') || msg.includes('invalid-email')) {
    return 'The adventurer email address is invalid. Please check for typos.';
  }
  if (code.includes('network-request-failed') || msg.includes('network-request-failed')) {
    return 'Network connection failed. Please check your internet connection.';
  }
  if (code.includes('popup-closed-by-user') || msg.includes('popup-closed-by-user')) {
    return 'Sign-in popup was closed before completing authentication.';
  }
  if (code.includes('popup-blocked') || msg.includes('popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  }
  if (code.includes('too-many-requests') || msg.includes('too-many-requests')) {
    return 'Too many failed attempts. Access temporarily blocked. Please wait a few minutes.';
  }

  // Strip technical prefix if present (e.g. "Firebase: Error (auth/xxx).")
  const cleanMsg = msg.replace(/^Firebase:\s*(Error\s*)?\(auth\/[^)]+\)\.?\s*/i, '').trim();
  return cleanMsg || msg || 'Authentication error. Please try again.';
}

export const authApi = {
  // Listen to Firebase Auth state
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Sync with Firestore backend (creates user profile if first login)
        const synced = await syncUserWithBackend(fbUser);
        const userObj: User = synced || {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Hero',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || '',
          createdAt: new Date().toISOString(),
          preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
        };
        dbStore.user = userObj;
        try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userObj)); } catch {}
        callback(userObj);
      } else {
        callback(null);
      }
    });
  },

  async getCurrentUser(): Promise<User | null> {
    // If Firebase user is signed in, fetch their Firestore profile from backend
    if (auth.currentUser) {
      try {
        const user = await fetchJson<User | null>('/api/auth/me');
        if (user) {
          dbStore.user = user;
          return user;
        }
      } catch {}
      // Fallback to Firebase user data if backend unavailable
      const fbUser = auth.currentUser;
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Hero',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || '',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
      };
      dbStore.user = userObj;
      return userObj;
    }

    await dbStore.delay(50);
    return dbStore.user ? { ...dbStore.user } : null;
  },

  async login(email: string, password?: string): Promise<User> {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid adventurer email address.');
    }

    let fbUser = auth.currentUser;
    // 1. Authenticate with Firebase Client Auth
    if (password && password.length >= 6) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
      } catch (err: any) {
        throw new Error(formatFirebaseAuthError(err));
      }
    }

    if (!fbUser) throw new Error('Firebase authentication required.');

    // 2. Sync with Firestore backend
    const synced = await syncUserWithBackend(fbUser);
    const user: User = synced || {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      avatar: fbUser.photoURL || '',
      createdAt: new Date().toISOString(),
      preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
    };
    dbStore.user = user;
    try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user)); } catch {}
    return user;
  },

  async signup(name: string, email: string, password?: string): Promise<User> {
    const trimmedName = (name || '').trim();
    if (!trimmedName) throw new Error('Hero name is required to forge your identity.');
    if (!email || !email.includes('@')) throw new Error('Valid adventurer email required.');

    // 1. Create account with Firebase Client Auth
    let fbUser = auth.currentUser;
    if (password && password.length >= 6) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = cred.user;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, password);
            fbUser = loginCred.user;
          } catch {
            throw new Error('This email is already registered. Please sign in instead.');
          }
        } else {
          throw new Error(formatFirebaseAuthError(err));
        }
      }
    }

    if (!fbUser) throw new Error('Firebase authentication required.');

    // 2. Sync with Firestore backend (creates new user profile)
    const synced = await syncUserWithBackend(fbUser, trimmedName);
    const user: User = synced || {
      id: fbUser.uid,
      name: trimmedName,
      email: fbUser.email || email,
      avatar: '',
      createdAt: new Date().toISOString(),
      preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
    };
    dbStore.user = user;
    if (dbStore.character) {
      dbStore.character.name = trimmedName;
    }
    try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user)); } catch {}
    return user;
  },

  async loginWithGoogle(): Promise<User> {
    // Sign in with Google popup
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Sync with Firestore backend
      const synced = await syncUserWithBackend(fbUser);
      const googleUser: User = synced || {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Hero',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || '',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
      };

      dbStore.user = googleUser;
      if (dbStore.character) {
        dbStore.character.name = googleUser.name;
      }
      try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(googleUser)); } catch {}
      return googleUser;
    } catch (err: any) {
      throw new Error(formatFirebaseAuthError(err));
    }
  },

  async updatePreferences(prefs: Partial<User['preferences']>): Promise<User> {
    try {
      const user = await fetchJson<User>('/api/auth/preferences', {
        method: 'POST',
        body: JSON.stringify(prefs),
      });
      dbStore.user = user;
      try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
      } catch {}
      return user;
    } catch {}

    if (!dbStore.user) throw new Error('No active hero session found.');
    dbStore.user.preferences = {
      ...dbStore.user.preferences,
      ...prefs,
    };
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(dbStore.user));
    } catch {}
    return { ...dbStore.user };
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {}
    try {
      await fetchJson('/api/auth/logout', { method: 'POST' });
    } catch {}
    dbStore.user = null;
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {}
  },
};
