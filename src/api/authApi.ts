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
        if (err.code === 'auth/wrong-password') throw new Error('Incorrect hero passphrase.');
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') throw new Error('Hero not found. Please sign up first.');
        throw new Error(err.message || 'Login failed. Please try again.');
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
    if (!name.trim()) throw new Error('Hero name is required.');
    if (!email.includes('@')) throw new Error('Valid email required.');

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
          } catch { throw new Error('Email already in use with a different password.'); }
        } else {
          throw new Error(err.message || 'Signup failed.');
        }
      }
    }

    if (!fbUser) throw new Error('Firebase authentication required.');

    // 2. Sync with Firestore backend (creates new user profile)
    const synced = await syncUserWithBackend(fbUser, name);
    const user: User = synced || {
      id: fbUser.uid,
      name,
      email: fbUser.email || email,
      avatar: '',
      createdAt: new Date().toISOString(),
      preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
    };
    dbStore.user = user;
    dbStore.character.name = name;
    try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user)); } catch {}
    return user;
  },

  async loginWithGoogle(): Promise<User> {
    // Sign in with Google popup
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
    dbStore.character.name = googleUser.name;
    try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(googleUser)); } catch {}
    return googleUser;
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
