import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(process.cwd(), 'server', 'serviceAccountKey.json');

let app: App | null = null;
let firestoreDb: Firestore | null = null;
let adminAuth: Auth | null = null;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'teachersday-1e00c',
      });
      console.log('🔥 [Firebase Admin] Initialized successfully with project:', serviceAccount.project_id);
    } else {
      app = getApps()[0];
    }

    firestoreDb = getFirestore(app);
    firestoreDb.settings({ ignoreUndefinedProperties: true });
    adminAuth = getAuth(app);
  } else {
    console.warn('⚠️ [Firebase Admin] serviceAccountKey.json not found, skipping Admin SDK initialization.');
  }
} catch (err) {
  console.error('❌ [Firebase Admin] Initialization error:', err);
}

export { app, firestoreDb, adminAuth };
