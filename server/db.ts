import {
  User,
  Character,
  Quest,
  Achievement,
  RewardItem,
  HistoryRecord,
  ProgressSummary,
  CompleteQuestResult,
  AttributeType,
} from './types';
import { firestoreDb } from './firebase';

export function getCumulativeXpForLevel(level: number): number {
  if (level <= 1) return 100;
  return 25 * (level * level) + 75 * level;
}

export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  while (totalXp >= getCumulativeXpForLevel(level)) {
    level++;
  }
  return level;
}

function userCol(uid: string, col: string) {
  if (!firestoreDb) throw new Error('Firestore not available');
  return firestoreDb.collection('users').doc(uid).collection(col);
}

function userDoc(uid: string, col: string, docId: string) {
  return userCol(uid, col).doc(docId);
}

export function makeDefaultCharacter(uid: string, name = 'Hero'): Character {
  return {
    id: "char_" + uid,
    userId: uid,
    name,
    heroClass: 'Scholar',
    title: 'Apprentice Seeker',
    avatarUrl: '',
    level: 1,
    xp: 0,
    gold: 0,
    streak: 0,
    longestStreak: 0,
    streakProtectionActive: false,
    streakHistory: [],
    attributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
    equipment: {},
    recentGains: {},
  };
}

function makeDefaultProgress(): ProgressSummary {
  return {
    currentLevel: 1, totalXp: 0, totalQuestsCompleted: 0, currentStreak: 0,
    longestStreak: 0, totalGoldEarned: 0, chartData: [],
    timeline: [{ level: 1, unlockedTitle: 'Apprentice Seeker', date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) }],
  };
}

function makeDefaultAchievements(): Achievement[] {
  return [
    { id:'ach_001', name:'FIRST QUEST', description:'Complete your first quest.', iconName:'Award', category:'Quests', requirement:'Complete 1 quest', progress:0, maxProgress:1, unlocked:false, rewardXp:50, rewardGold:20 },
    { id:'ach_002', name:'DISCIPLINE INCARNATE', description:'7-day streak.', iconName:'Flame', category:'Streak', requirement:'7-day streak', progress:0, maxProgress:7, unlocked:false, rewardXp:150, rewardGold:75 },
    { id:'ach_003', name:'MIND PALACE', description:'Intelligence >= 50.', iconName:'Sparkles', category:'Attributes', requirement:'Intelligence >= 50', progress:0, maxProgress:50, unlocked:false, rewardXp:200, rewardGold:100 },
    { id:'ach_004', name:'QUEST MASTER', description:'Complete 50 quests.', iconName:'Scroll', category:'Quests', requirement:'Complete 50 quests', progress:0, maxProgress:50, unlocked:false, rewardXp:300, rewardGold:150 },
    { id:'ach_005', name:'DOUBLE DIGITS', description:'Reach Level 10.', iconName:'Trophy', category:'Level', requirement:'Level 10', progress:0, maxProgress:10, unlocked:false, rewardXp:250, rewardGold:120 },
    { id:'ach_006', name:'MONTH OF WILL', description:'30-day streak.', iconName:'Zap', category:'Streak', requirement:'30-day streak', progress:0, maxProgress:30, unlocked:false, rewardXp:500, rewardGold:250 },
    { id:'ach_007', name:'IRON BODY', description:'Endurance >= 50.', iconName:'Shield', category:'Attributes', requirement:'Endurance >= 50', progress:0, maxProgress:50, unlocked:false, rewardXp:200, rewardGold:100 },
  ];
}

// Starter quests removed — only user-created quests from the database are used


function makeDefaultRewards(): RewardItem[] {
  return [
    { id:'rew_000_a', name:'Novice Adventurer Charm', description:'A lucky gilded medallion. +2 Wisdom.', price:20, category:'Badges', icon:'Sparkles', rarity:'Common', owned:false, statBonus:{attribute:'wisdom',amount:2} },
    { id:'rew_000_b', name:'Initiate Training Dagger', description:'Sharp balanced blade for beginner warriors. +3 Strength.', price:35, category:'Gear', icon:'Sword', rarity:'Common', owned:false, equipped:false, statBonus:{attribute:'strength',amount:3} },
    { id:'rew_000_c', name:'Focus Silk Bandana', description:'Keeps hair and distractions away. +3 Discipline.', price:50, category:'Gear', icon:'Zap', rarity:'Common', owned:false, equipped:false, statBonus:{attribute:'discipline',amount:3} },
    { id:'rew_000_d', name:'Pocket Ember Familiar', description:'A warm spectral wisp that keeps you company on quests.', price:75, category:'Pets', icon:'Cat', rarity:'Rare', owned:false, equipped:false },
    { id:'rew_001', name:'Shadow Blade of Focus', description:'Slices through procrastination. +5 Strength.', price:500, category:'Gear', icon:'Sword', rarity:'Epic', owned:false, equipped:false, statBonus:{attribute:'strength',amount:5} },
    { id:'rew_002', name:'Cyber Theme HUD', description:'Futuristic neon UI theme.', price:300, category:'Themes', icon:'Palette', rarity:'Rare', owned:false },
    { id:'rew_003', name:'Dragon Crest of Valor', description:'Legendary title crest.', price:750, category:'Badges', icon:'ShieldCheck', rarity:'Legendary', owned:false },
    { id:'rew_004', name:'Cyber Gryphon Companion', description:'Ethereal familiar companion.', price:1000, category:'Pets', icon:'Sparkles', rarity:'Legendary', owned:false },
    { id:'rew_005', name:'Boots of Prompt Execution', description:'+4 Discipline bonus.', price:450, category:'Gear', icon:'Zap', rarity:'Rare', owned:false, equipped:false, statBonus:{attribute:'discipline',amount:4} },
    { id:'rew_006', name:'Solar Flare Theme', description:'Warm gold solar theme.', price:350, category:'Themes', icon:'Sun', rarity:'Rare', owned:false },
    { id:'rew_007', name:'Ring of Deep Contemplation', description:'+6 Intelligence.', price:600, category:'Gear', icon:'Compass', rarity:'Epic', owned:false, equipped:false, statBonus:{attribute:'intelligence',amount:6} },
    { id:'rew_008', name:'Rune-Woven Scholar Cloak', description:'+8 Wisdom aesthetic.', price:850, category:'Gear', icon:'Shield', rarity:'Epic', owned:false, equipped:false },
  ];
}

export class UserDatabase {
  constructor(private uid: string) {}

  async getUser(): Promise<User | null> {
    if (!firestoreDb) return null;
    const snap = await firestoreDb.collection('users').doc(this.uid).get();
    return snap.exists ? (snap.data() as User) : null;
  }

  async setUser(user: User): Promise<User> {
    if (!firestoreDb) throw new Error('Firestore not available');
    await firestoreDb.collection('users').doc(this.uid).set(user, { merge: true });
    return user;
  }

  async updateUserPreferences(prefs: Partial<User['preferences']>): Promise<User> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const user = await this.getUser();
    if (!user) throw new Error('User not found');
    const updated: User = { ...user, preferences: { ...user.preferences, ...prefs } };
    await firestoreDb.collection('users').doc(this.uid).set(updated, { merge: true });
    return updated;
  }

  async getCharacter(): Promise<Character> {
    if (!firestoreDb) return makeDefaultCharacter(this.uid);
    const snap = await userDoc(this.uid, 'character', 'main').get();
    if (snap.exists) return snap.data() as Character;
    const def = makeDefaultCharacter(this.uid);
    await userDoc(this.uid, 'character', 'main').set(def);
    return def;
  }

  async updateCharacter(updates: Partial<Character>): Promise<Character> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const current = await this.getCharacter();
    const updated: Character = {
      ...current, ...updates,
      attributes: { ...current.attributes, ...(updates.attributes || {}) },
      equipment: { ...current.equipment, ...(updates.equipment || {}) },
      recentGains: { ...current.recentGains, ...(updates.recentGains || {}) },
    };
    await userDoc(this.uid, 'character', 'main').set(updated);
    return updated;
  }

  async getQuests(): Promise<Quest[]> {
    if (!firestoreDb) return [];
    const snap = await userCol(this.uid, 'quests').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      return [];
    }
    return snap.docs.map((d) => d.data() as Quest);
  }

  async createQuest(questData: Omit<Quest, 'id' | 'createdAt' | 'status'>): Promise<Quest> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const newQuest: Quest = { ...questData, id: `qst_${Date.now()}_${Math.random().toString(36).slice(2)}`, status:'Active', createdAt:new Date().toISOString() };
    await userDoc(this.uid, 'quests', newQuest.id).set(newQuest);
    return newQuest;
  }

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const snap = await userDoc(this.uid, 'quests', id).get();
    if (!snap.exists) throw new Error('Quest not found');
    const updated: Quest = { ...(snap.data() as Quest), ...updates };
    await userDoc(this.uid, 'quests', id).set(updated);
    return updated;
  }

  async deleteQuest(id: string): Promise<boolean> {
    if (!firestoreDb) return false;
    const snap = await userDoc(this.uid, 'quests', id).get();
    if (!snap.exists) return false;
    await userDoc(this.uid, 'quests', id).delete();
    return true;
  }

  async completeQuest(id: string, fallbackData?: Partial<Quest>): Promise<CompleteQuestResult> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const snap = await userDoc(this.uid, 'quests', id).get();
    let quest: Quest;

    if (!snap.exists) {
      const today = new Date().toISOString().split('T')[0];
      quest = {
        id,
        userId: this.uid,
        title: fallbackData?.title || 'Daily Quest Bounty',
        description: fallbackData?.description || '',
        category: fallbackData?.category || 'Knowledge',
        difficulty: fallbackData?.difficulty || 'Medium',
        estimatedTime: fallbackData?.estimatedTime || '30m',
        xpReward: fallbackData?.xpReward || 50,
        goldReward: fallbackData?.goldReward || 20,
        attribute: fallbackData?.attribute || 'intelligence',
        attributeReward: fallbackData?.attributeReward || 5,
        dueDate: fallbackData?.dueDate || today,
        status: 'Completed',
        completedAt: new Date().toISOString(),
        createdAt: fallbackData?.createdAt || new Date().toISOString(),
        repeat: fallbackData?.repeat || 'None',
      };
    } else {
      quest = snap.data() as Quest;
      if (quest.status === 'Completed') throw new Error('Quest is already completed');
      quest.status = 'Completed';
      quest.completedAt = new Date().toISOString();
    }

    const xpGained = quest.xpReward || 50;
    const goldGained = quest.goldReward || 20;
    const attr = quest.attribute || 'intelligence';
    const attrGained = quest.attributeReward || 5;

    const char = await this.getCharacter();
    const oldLevel = char.level || 1;
    const newXp = (char.xp || 0) + xpGained;
    const newLevel = getLevelFromXp(newXp);
    let levelUpInfo: CompleteQuestResult['levelUp'] = undefined;
    if (newLevel > oldLevel) levelUpInfo = { oldLevel, newLevel, unlockedReward: 'Arcane Stat Enhancer' };

    const updatedChar: Character = {
      ...char,
      xp: newXp,
      gold: (char.gold || 0) + goldGained,
      level: newLevel,
      attributes: { ...char.attributes, [attr]: ((char.attributes?.[attr] || 0) + attrGained) },
      recentGains: { ...char.recentGains, [attr]: (((char.recentGains as any)?.[attr] || 0) + attrGained) },
    };

    const progress = await this.getProgress();
    const updatedProgress: ProgressSummary = {
      ...progress,
      totalXp: newXp,
      totalQuestsCompleted: (progress.totalQuestsCompleted || 0) + 1,
      totalGoldEarned: (progress.totalGoldEarned || 0) + goldGained,
      currentLevel: newLevel,
      currentStreak: updatedChar.streak,
      longestStreak: updatedChar.longestStreak,
    };

    const historyItem: HistoryRecord = {
      id: `his_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      questId: quest.id,
      title: quest.title,
      category: quest.category,
      xpGained,
      goldGained,
      attributeGained: { attribute: attr, amount: attrGained },
      timestamp: 'Just now',
      type: 'quest_complete',
    };

    const batch = firestoreDb.batch();
    batch.set(userDoc(this.uid, 'quests', id), quest);
    batch.set(userDoc(this.uid, 'character', 'main'), updatedChar);
    batch.set(userDoc(this.uid, 'progress', 'summary'), updatedProgress);
    batch.set(userDoc(this.uid, 'history', historyItem.id), historyItem);

    // If repeat quest, create a fresh active copy for the next cycle
    if (quest.repeat && quest.repeat !== 'None') {
      const now = new Date();
      let nextDue: Date;
      if (quest.repeat === 'Daily') {
        nextDue = new Date(now);
        nextDue.setDate(nextDue.getDate() + 1);
      } else if (quest.repeat === 'Weekly') {
        nextDue = new Date(now);
        nextDue.setDate(nextDue.getDate() + 7);
      } else if (quest.repeat === 'Monthly') {
        nextDue = new Date(now);
        nextDue.setMonth(nextDue.getMonth() + 1);
      } else {
        nextDue = new Date(now);
        nextDue.setDate(nextDue.getDate() + 1);
      }
      const newRepeatQuestId = `${id}_repeat_${Date.now()}`;
      const newRepeatQuest: Quest = {
        ...quest,
        id: newRepeatQuestId,
        status: 'Active',
        dueDate: nextDue.toISOString().split('T')[0],
        completedAt: undefined,
        createdAt: new Date().toISOString(),
      };
      batch.set(userDoc(this.uid, 'quests', newRepeatQuestId), newRepeatQuest);
    }

    await batch.commit();

    await this.syncAchievements(updatedChar, updatedProgress.totalQuestsCompleted);
    return { quest, xpGained, goldGained, attribute: attr, attributeGained: attrGained, levelUp: levelUpInfo };
  }

  async getAchievements(): Promise<Achievement[]> {
    if (!firestoreDb) return makeDefaultAchievements();
    const snap = await userCol(this.uid, 'achievements').get();
    if (snap.empty) {
      const defaults = makeDefaultAchievements();
      const batch = firestoreDb.batch();
      for (const ach of defaults) batch.set(userDoc(this.uid, 'achievements', ach.id), ach);
      await batch.commit();
      return defaults;
    }
    return snap.docs.map((d) => d.data() as Achievement);
  }

  async syncAchievements(char: Character, totalCompleted: number): Promise<void> {
    if (!firestoreDb) return;
    const achievements = await this.getAchievements();
    const batch = firestoreDb.batch();
    for (const ach of achievements) {
      let newProgress = ach.progress;
      if (ach.id === 'ach_001') newProgress = Math.min(1, totalCompleted);
      if (ach.id === 'ach_002') newProgress = char.streak;
      if (ach.id === 'ach_003') newProgress = char.attributes.intelligence;
      if (ach.id === 'ach_004') newProgress = totalCompleted;
      if (ach.id === 'ach_005') newProgress = char.level;
      if (ach.id === 'ach_006') newProgress = char.streak;
      if (ach.id === 'ach_007') newProgress = char.attributes.endurance;
      const updated = { ...ach, progress: newProgress };
      if (newProgress >= ach.maxProgress && !ach.unlocked) {
        updated.unlocked = true;
        (updated as any).unlockedAt = new Date().toISOString();
      }
      batch.set(userDoc(this.uid, 'achievements', ach.id), updated);
    }
    await batch.commit();
  }

  async claimAchievement(id: string): Promise<{ achievement: Achievement; xpAwarded: number; goldAwarded: number }> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const snap = await userDoc(this.uid, 'achievements', id).get();
    if (!snap.exists) throw new Error('Achievement not found');
    const ach = snap.data() as Achievement;
    if (!ach.unlocked) throw new Error('Achievement requirements not yet met');
    return { achievement: ach, xpAwarded: ach.rewardXp, goldAwarded: ach.rewardGold };
  }

  async getRewards(): Promise<RewardItem[]> {
    if (!firestoreDb) return makeDefaultRewards();
    const snap = await userCol(this.uid, 'rewards').get();
    if (snap.empty) {
      const defaults = makeDefaultRewards();
      const batch = firestoreDb.batch();
      for (const r of defaults) batch.set(userDoc(this.uid, 'rewards', r.id), r);
      await batch.commit();
      return defaults;
    }
    return snap.docs.map((d) => d.data() as RewardItem);
  }

  async purchaseReward(rewardId: string): Promise<{ reward: RewardItem; remainingGold: number }> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const snap = await userDoc(this.uid, 'rewards', rewardId).get();
    if (!snap.exists) throw new Error('Item not found');
    const item = snap.data() as RewardItem;
    if (item.owned) throw new Error('You already own this item');
    const char = await this.getCharacter();
    if (char.gold < item.price) throw new Error('Insufficient gold! You need ' + item.price + ', have ' + char.gold + '.');

    const updatedItem: RewardItem = { ...item, owned: true };
    const updatedChar: Character = {
      ...char, gold: char.gold - item.price,
      attributes: item.statBonus ? { ...char.attributes, [item.statBonus.attribute]: (char.attributes[item.statBonus.attribute]||0) + item.statBonus.amount } : char.attributes,
    };
    const historyItem: HistoryRecord = { id: 'his_' + Date.now(), title: 'Acquired ' + item.name, category:'Personal', xpGained:0, goldGained:-item.price, timestamp:'Just now', type:'shop_purchase' };
    const batch = firestoreDb.batch();
    batch.set(userDoc(this.uid, 'rewards', rewardId), updatedItem);
    batch.set(userDoc(this.uid, 'character', 'main'), updatedChar);
    batch.set(userDoc(this.uid, 'history', historyItem.id), historyItem);
    await batch.commit();
    return { reward: updatedItem, remainingGold: updatedChar.gold };
  }

  async toggleEquipReward(rewardId: string): Promise<RewardItem> {
    if (!firestoreDb) throw new Error('Firestore not available');
    const snap = await userDoc(this.uid, 'rewards', rewardId).get();
    if (!snap.exists) throw new Error('Item not found');
    const item = snap.data() as RewardItem;
    if (!item.owned) throw new Error('Item is not owned');
    const updatedItem: RewardItem = { ...item, equipped: !item.equipped };
    const char = await this.getCharacter();
    const lower = item.name.toLowerCase();
    let equipment = { ...char.equipment };
    if (item.category === 'Gear') {
      if (lower.includes('sword') || lower.includes('blade')) equipment.weapon = updatedItem.equipped ? item.name : undefined;
      else if (lower.includes('cloak') || lower.includes('armor')) equipment.armor = updatedItem.equipped ? item.name : undefined;
      else if (lower.includes('boots')) equipment.boots = updatedItem.equipped ? item.name : undefined;
      else if (lower.includes('ring')) equipment.ring = updatedItem.equipped ? item.name : undefined;
    } else if (item.category === 'Pets') {
      equipment.pet = updatedItem.equipped ? item.name : undefined;
    }
    const batch = firestoreDb.batch();
    batch.set(userDoc(this.uid, 'rewards', rewardId), updatedItem);
    batch.set(userDoc(this.uid, 'character', 'main'), { ...char, equipment });
    await batch.commit();
    return updatedItem;
  }

  async getProgress(): Promise<ProgressSummary> {
    if (!firestoreDb) return makeDefaultProgress();
    const snap = await userDoc(this.uid, 'progress', 'summary').get();
    if (snap.exists) return snap.data() as ProgressSummary;
    const def = makeDefaultProgress();
    await userDoc(this.uid, 'progress', 'summary').set(def);
    return def;
  }

  async getHistory(filter?: string): Promise<HistoryRecord[]> {
    if (!firestoreDb) return [];
    const snap = await userCol(this.uid, 'history').orderBy('id', 'desc').limit(50).get();
    const records = snap.docs.map((d) => d.data() as HistoryRecord);
    if (!filter || filter === 'all') return records;
    if (filter === 'today') return records.filter((r) => r.timestamp.toLowerCase().includes('today') || r.timestamp.toLowerCase().includes('just now'));
    if (filter === 'week') return records.slice(0, 15);
    return records;
  }

  async setupNewUser(user: User, heroClass?: string, name?: string): Promise<void> {
    if (!firestoreDb) return;
    const titleMap: Record<string, string> = { Warrior:'Vanguard of Discipline', Scholar:'Seeker of Prismatic Knowledge', Creator:'Architect of New Realities', Explorer:'Pioneer of the Unknown Frontiers' };
    const char = makeDefaultCharacter(this.uid, name || user.name);
    if (heroClass) { char.heroClass = heroClass as Character['heroClass']; char.title = titleMap[heroClass] || 'Apprentice Seeker'; }
    const progress = makeDefaultProgress();
    const achievements = makeDefaultAchievements();
    const rewards = makeDefaultRewards();
    const batch = firestoreDb.batch();
    batch.set(firestoreDb.collection('users').doc(this.uid), user, { merge: true });
    batch.set(userDoc(this.uid, 'character', 'main'), char);
    batch.set(userDoc(this.uid, 'progress', 'summary'), progress);
    for (const ach of achievements) batch.set(userDoc(this.uid, 'achievements', ach.id), ach);
    for (const r of rewards) batch.set(userDoc(this.uid, 'rewards', r.id), r);
    await batch.commit();
    console.log('[Firestore] New user ' + this.uid + ' setup complete');
  }
}

export function getUserDb(uid: string): UserDatabase {
  return new UserDatabase(uid);
}

// Legacy compatibility export (for gradual migration)
export const db = {
  getUser: async () => null,
  setUser: async () => {},
  getCharacter: async (uid: string) => getUserDb(uid).getCharacter(),
};

