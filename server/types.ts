export type QuestCategory = 
  | 'Knowledge'
  | 'Coding'
  | 'Fitness'
  | 'Health'
  | 'Creativity'
  | 'Discipline'
  | 'Personal'
  | 'Other';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

export type QuestStatus = 'Active' | 'Completed' | 'Failed';

export type QuestRepeat = 'None' | 'Daily' | 'Weekly';

export type AttributeType = 
  | 'strength'
  | 'intelligence'
  | 'wisdom'
  | 'discipline'
  | 'endurance'
  | 'creativity';

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  estimatedTime: string;
  xpReward: number;
  goldReward: number;
  attribute: AttributeType;
  attributeReward: number;
  dueDate: string;
  dueTime?: string;
  status: QuestStatus;
  repeat: QuestRepeat;
  createdAt: string;
  completedAt?: string;
}

export interface CharacterAttributes {
  strength: number;
  intelligence: number;
  wisdom: number;
  discipline: number;
  endurance: number;
  creativity: number;
}

export interface CharacterEquipment {
  weapon?: string;
  armor?: string;
  boots?: string;
  ring?: string;
  pet?: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  heroClass: 'Warrior' | 'Scholar' | 'Creator' | 'Explorer';
  title: string;
  avatarUrl: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  longestStreak: number;
  streakProtectionActive: boolean;
  streakHistory: { day: string; date: string; completed: boolean }[];
  attributes: CharacterAttributes;
  equipment: CharacterEquipment;
  recentGains: { [key in AttributeType]?: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  preferences: {
    theme: 'fantasy-dark' | 'cyber-dark' | 'solar-dark';
    soundEnabled: boolean;
    reducedMotion: boolean;
    notifications: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Quests' | 'Streak' | 'Level' | 'Attributes' | 'Special';
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardXp: number;
  rewardGold: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Gear' | 'Themes' | 'Badges' | 'Pets';
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  owned: boolean;
  equipped?: boolean;
  statBonus?: { attribute: AttributeType; amount: number };
}

export interface HistoryRecord {
  id: string;
  questId?: string;
  title: string;
  category: QuestCategory;
  xpGained: number;
  goldGained: number;
  attributeGained?: { attribute: AttributeType; amount: number };
  timestamp: string;
  type: 'quest_complete' | 'level_up' | 'achievement_unlock' | 'shop_purchase';
}

export interface ProgressSummary {
  currentLevel: number;
  totalXp: number;
  totalQuestsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalGoldEarned: number;
  chartData: { date: string; xp: number; quests: number }[];
  timeline: { level: number; unlockedTitle: string; date: string }[];
}

export interface CompleteQuestResult {
  quest: Quest;
  xpGained: number;
  goldGained: number;
  attribute: AttributeType;
  attributeGained: number;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
    unlockedReward?: string;
  };
}
