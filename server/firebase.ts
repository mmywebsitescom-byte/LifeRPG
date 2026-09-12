import { initializeApp, cert, getApps, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

let app: App | null = null;
let firestoreDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function getServiceAccountCredential(): ServiceAccount | null {
  // 1. Prefer local serviceAccountKey.json file if present (dedicated key for this workspace)
  const serviceAccountPath = path.resolve(process.cwd(), 'server', 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const content = fs.readFileSync(serviceAccountPath, 'utf-8');
      const parsed = JSON.parse(content) as ServiceAccount;
      return parsed;
    } catch (err) {
      console.warn('⚠️ [Firebase Admin] Failed to read server/serviceAccountKey.json:', err);
    }
  }

  // 2. Check FIREBASE_SERVICE_ACCOUNT environment variable (full JSON or base64 JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      const jsonString = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      const parsed = JSON.parse(jsonString);
      return parsed as ServiceAccount;
    } catch (err) {
      console.warn('⚠️ [Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', err);
    }
  }

  // 3. Check discrete environment variables (Vercel standard)
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    let rawKey = process.env.FIREBASE_PRIVATE_KEY.trim();
    if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
      rawKey = rawKey.slice(1, -1);
    }
    const privateKey = rawKey.replace(/\\n/g, '\n');

    return {
      projectId: process.env.FIREBASE_PROJECT_ID || 'teachersday-1e00c',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
      privateKey,
    };
  }

  return null;
}

try {
  const credential = getServiceAccountCredential();

  if (credential) {
    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert(credential),
        projectId: (credential as any).projectId || (credential as any).project_id || 'teachersday-1e00c',
      });
      console.log('🔥 [Firebase Admin] Initialized successfully with project:', (credential as any).projectId || (credential as any).project_id);
    } else {
      app = getApps()[0];
    }

    firestoreDb = getFirestore(app);
    firestoreDb.settings({ ignoreUndefinedProperties: true });
    adminAuth = getAuth(app);
  } else {
    console.warn('⚠️ [Firebase Admin] No Firebase credentials provided (checked env vars and serviceAccountKey.json). Skipping Admin SDK initialization.');
  }
} catch (err) {
  console.error('❌ [Firebase Admin] Initialization error:', err);
}

export { app, firestoreDb, adminAuth };
