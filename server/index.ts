import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { getUserDb, makeDefaultCharacter } from './db';
import { generateQuestsWithGemini } from './ai';
import { adminAuth, firestoreDb } from './firebase';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable ETag and caching for API routes — ensures fresh Firestore data on every request
app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.set('etag', false);


// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const d = Date.now() - start;
    if (!req.url.includes('/api/health')) console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${d}ms)`);
  });
  next();
});

// ─── Firebase Auth middleware ─────────────────────────────────────────────────
// Extend Request type to carry uid
declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ') && adminAuth) {
    const idToken = authHeader.slice(7);
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      req.uid = decoded.uid;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired Firebase token' });
    }
  }
  // Fallback: accept uid from body or query (dev mode without token)
  const uid = req.body?.uid || req.query?.uid as string;
  if (uid) {
    req.uid = uid;
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication required. Send Authorization: Bearer <Firebase ID token>' });
}

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'LIFE RPG Backend is operational', timestamp: new Date().toISOString(), firebase: !!firestoreDb });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Called after Firebase client-side sign-in to register/fetch user profile
app.post('/api/auth/register', requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = req.uid!;
    const { name, email, heroClass, avatarUrl } = req.body;
    const dbUser = getUserDb(uid);
    let user = await dbUser.getUser();
    if (!user) {
      user = {
        id: uid,
        name: name || email?.split('@')[0] || 'Hero',
        email: email || '',
        avatar: avatarUrl || '',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
      };
      await dbUser.setupNewUser(user, heroClass, name);
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await getUserDb(req.uid!).getUser();
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/preferences', requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await getUserDb(req.uid!).updateUserPreferences(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Legacy login/signup endpoints (for backwards compat - register user in Firestore)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, uid } = req.body;
  if (!uid) return res.status(400).json({ success: false, error: 'Firebase UID required' });
  try {
    const dbUser = getUserDb(uid);
    let user = await dbUser.getUser();
    if (!user) {
      user = {
        id: uid, name: email?.split('@')[0] || 'Hero', email: email || '',
        avatar: '',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
      };
      await dbUser.setupNewUser(user);
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { name, email, uid } = req.body;
  if (!uid) return res.status(400).json({ success: false, error: 'Firebase UID required' });
  try {
    const dbUser = getUserDb(uid);
    let user = await dbUser.getUser();
    if (!user) {
      user = {
        id: uid, name: name || email?.split('@')[0] || 'Hero', email: email || '',
        avatar: '',
        createdAt: new Date().toISOString(),
        preferences: { theme: 'fantasy-dark', soundEnabled: true, reducedMotion: false, notifications: true },
      };
      await dbUser.setupNewUser(user, undefined, name);
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── Character ────────────────────────────────────────────────────────────────
app.get('/api/character', requireAuth, async (req: Request, res: Response) => {
  try {
    const character = await getUserDb(req.uid!).getCharacter();
    res.json({ success: true, data: character });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/character', requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await getUserDb(req.uid!).updateCharacter(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

app.post('/api/character/equip', requireAuth, async (req: Request, res: Response) => {
  const { slot, itemName } = req.body;
  if (!slot) return res.status(400).json({ success: false, error: 'Equipment slot required' });
  try {
    const db = getUserDb(req.uid!);
    const current = await db.getCharacter();
    const updated = await db.updateCharacter({ equipment: { ...current.equipment, [slot]: itemName || undefined } });
    res.json({ success: true, data: updated });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

app.post('/api/character/setup', requireAuth, async (req: Request, res: Response) => {
  const { heroClass, name, avatarUrl } = req.body;
  const titleMap: Record<string, string> = {
    Warrior: 'Vanguard of Discipline', Scholar: 'Seeker of Prismatic Knowledge',
    Creator: 'Architect of New Realities', Explorer: 'Pioneer of the Unknown Frontiers',
  };
  try {
    const updated = await getUserDb(req.uid!).updateCharacter({
      heroClass, name, avatarUrl, title: titleMap[heroClass] || 'Hero of the Realm',
    });
    res.json({ success: true, data: updated });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

// ─── Quests ───────────────────────────────────────────────────────────────────
app.get('/api/quests', requireAuth, async (req: Request, res: Response) => {
  try {
    const quests = await getUserDb(req.uid!).getQuests();
    res.json({ success: true, data: quests });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/quests', requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, description, category, difficulty, estimatedTime, xpReward, goldReward, attribute, attributeReward, dueDate, dueTime, repeat } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, error: 'Quest title is required' });
    const newQuest = await getUserDb(req.uid!).createQuest({
      userId: req.uid!,
      title: title.trim(),
      description: (description || '').trim(),
      category: category || 'Knowledge',
      difficulty: difficulty || 'Medium',
      estimatedTime: estimatedTime || '30m',
      xpReward: Number(xpReward) || 50,
      goldReward: Number(goldReward) || 20,
      attribute: attribute || 'intelligence',
      attributeReward: Number(attributeReward) || 5,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      dueTime: dueTime || undefined,
      repeat: repeat || 'None',
    });
    res.status(201).json({ success: true, data: newQuest });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

app.put('/api/quests/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await getUserDb(req.uid!).updateQuest(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) { res.status(404).json({ success: false, error: err.message }); }
});

app.delete('/api/quests/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const ok = await getUserDb(req.uid!).deleteQuest(req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Quest not found' });
    res.json({ success: true, message: 'Quest deleted' });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

app.post('/api/quests/:id/complete', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getUserDb(req.uid!).completeQuest(req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

// ─── Achievements ─────────────────────────────────────────────────────────────
app.get('/api/achievements', requireAuth, async (req: Request, res: Response) => {
  try {
    const achievements = await getUserDb(req.uid!).getAchievements();
    res.json({ success: true, data: achievements });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/achievements/:id/claim', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getUserDb(req.uid!).claimAchievement(req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

// ─── Rewards ──────────────────────────────────────────────────────────────────
app.get('/api/rewards', requireAuth, async (req: Request, res: Response) => {
  try {
    const rewards = await getUserDb(req.uid!).getRewards();
    res.json({ success: true, data: rewards });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/rewards/:id/purchase', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getUserDb(req.uid!).purchaseReward(req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

app.post('/api/rewards/:id/equip', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getUserDb(req.uid!).toggleEquipReward(req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }); }
});

// ─── Progress & History ───────────────────────────────────────────────────────
app.get('/api/progress/summary', requireAuth, async (req: Request, res: Response) => {
  try {
    const summary = await getUserDb(req.uid!).getProgress();
    res.json({ success: true, data: summary });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string | undefined;
    const history = await getUserDb(req.uid!).getHistory(filter);
    res.json({ success: true, data: history });
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
});

// ─── AI Quest Generation ──────────────────────────────────────────────────────
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, category, difficulty } = req.body;
    const quests = await generateQuestsWithGemini(prompt || '', category, difficulty);
    res.json({ success: true, data: quests });
  } catch (err: any) {
    console.error('AI generation error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate quests' });
  }
});

// ─── Static (production) ──────────────────────────────────────────────────────
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) return next();
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, (err) => { if (err) next(); });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================')
  console.log('Sword  LIFE RPG Backend (Firebase) running on http://localhost:' + PORT)
  console.log('Sword  REST API Ready at http://localhost:' + PORT + '/api')
  console.log('====================================================')
});

export default app;

