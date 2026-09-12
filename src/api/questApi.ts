import { Quest, QuestCategory, QuestDifficulty, QuestRepeat, AttributeType } from '../types';
import { dbStore } from './store';
import { getCumulativeXpForLevel } from '../utils/rpgEngine';
import { fetchJson } from './client';

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

export const questApi = {
  async getQuests(): Promise<Quest[]> {
    try {
      const data = await fetchJson<Quest[]>('/api/quests');
      dbStore.quests = data;
      return [...data];
    } catch {
      await dbStore.delay(100);
      return [...dbStore.quests];
    }
  },

  async createQuest(payload: {
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
    repeat: QuestRepeat;
  }): Promise<Quest> {
    try {
      const newQuest = await fetchJson<Quest>('/api/quests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      dbStore.quests.unshift(newQuest);
      return { ...newQuest };
    } catch {
      await dbStore.delay(150);
      const newQuest: Quest = {
        id: `qst_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: dbStore.user ? dbStore.user.id : 'usr_001',
        title: payload.title.trim(),
        description: payload.description.trim(),
        category: payload.category,
        difficulty: payload.difficulty,
        estimatedTime: payload.estimatedTime || '30m',
        xpReward: payload.xpReward,
        goldReward: payload.goldReward,
        attribute: payload.attribute,
        attributeReward: payload.attributeReward,
        dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
        dueTime: payload.dueTime,
        status: 'Active',
        repeat: payload.repeat || 'None',
        createdAt: new Date().toISOString(),
      };
      dbStore.quests.unshift(newQuest);
      return { ...newQuest };
    }
  },

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest> {
    try {
      const updated = await fetchJson<Quest>(`/api/quests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const index = dbStore.quests.findIndex((q) => q.id === id);
      if (index !== -1) dbStore.quests[index] = updated;
      return { ...updated };
    } catch {
      await dbStore.delay(150);
      const index = dbStore.quests.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Quest not found.');
      dbStore.quests[index] = { ...dbStore.quests[index], ...updates };
      return { ...dbStore.quests[index] };
    }
  },

  async deleteQuest(id: string): Promise<void> {
    try {
      await fetchJson(`/api/quests/${id}`, { method: 'DELETE' });
      const index = dbStore.quests.findIndex((q) => q.id === id);
      if (index !== -1) dbStore.quests.splice(index, 1);
      return;
    } catch {
      await dbStore.delay(150);
      const index = dbStore.quests.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Quest not found.');
      dbStore.quests.splice(index, 1);
    }
  },

  async completeQuest(id: string): Promise<CompleteQuestResult> {
    const localQuest = dbStore.quests.find((q) => q.id === id);
    try {
      const result = await fetchJson<CompleteQuestResult>(`/api/quests/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(localQuest || {}),
      });
      const index = dbStore.quests.findIndex((q) => q.id === id);
      if (index !== -1) dbStore.quests[index] = result.quest;
      if (dbStore.character) {
        dbStore.character.gold += result.goldGained;
        dbStore.character.xp += result.xpGained;
        if (result.levelUp) dbStore.character.level = result.levelUp.newLevel;
      }
      return result;
    } catch {
      await dbStore.delay(200);
      const quest = dbStore.quests.find((q) => q.id === id);
      if (!quest) throw new Error('Quest not found.');
      if (quest.status === 'Completed') throw new Error('Quest is already completed.');

      quest.status = 'Completed';
      quest.completedAt = new Date().toISOString();

      const xpGained = quest.xpReward;
      const goldGained = quest.goldReward;
      const attr = quest.attribute;
      const attrGained = quest.attributeReward;

      const oldLevel = dbStore.character.level;
      const oldXp = dbStore.character.xp;
      const newXp = oldXp + xpGained;
      dbStore.character.xp = newXp;
      dbStore.character.gold += goldGained;
      dbStore.character.attributes[attr] = (dbStore.character.attributes[attr] || 0) + attrGained;
      dbStore.character.recentGains[attr] = (dbStore.character.recentGains[attr] || 0) + attrGained;

      let currentLvl = oldLevel;
      while (newXp >= getCumulativeXpForLevel(currentLvl)) {
        currentLvl++;
      }

      let levelUpInfo: CompleteQuestResult['levelUp'] = undefined;
      if (currentLvl > oldLevel) {
        dbStore.character.level = currentLvl;
        levelUpInfo = {
          oldLevel,
          newLevel: currentLvl,
          unlockedReward: currentLvl === 13 ? 'Master Focus Crest & 150 Bonus Gold' : 'Arcane Stat Enhancer',
        };
      }

      dbStore.progress.totalXp += xpGained;
      dbStore.progress.totalQuestsCompleted += 1;
      dbStore.progress.totalGoldEarned += goldGained;

      dbStore.history.unshift({
        id: `his_${Date.now()}`,
        questId: quest.id,
        title: quest.title,
        category: quest.category,
        xpGained,
        goldGained,
        attributeGained: { attribute: attr, amount: attrGained },
        timestamp: 'Just now',
        type: 'quest_complete',
      });

      return {
        quest: { ...quest },
        xpGained,
        goldGained,
        attribute: attr,
        attributeGained: attrGained,
        levelUp: levelUpInfo,
      };
    }
  },
};
