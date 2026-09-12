import { Achievement } from '../types';
import { dbStore } from './store';
import { fetchJson } from './client';

export const achievementApi = {
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await fetchJson<Achievement[]>('/api/achievements');
      dbStore.achievements = data;
      return [...data];
    } catch {
      await dbStore.delay(100);
      const char = dbStore.character;
      dbStore.achievements.forEach((ach) => {
        if (ach.id === 'ach_002') ach.progress = char.streak;
        if (ach.id === 'ach_003') ach.progress = char.attributes.intelligence;
        if (ach.id === 'ach_005') ach.progress = char.level;
        if (ach.id === 'ach_006') ach.progress = char.streak;
        if (ach.id === 'ach_007') ach.progress = char.attributes.endurance;

        if (ach.progress >= ach.maxProgress && !ach.unlocked) {
          ach.unlocked = true;
          ach.unlockedAt = new Date().toISOString();
        }
      });
      return [...dbStore.achievements];
    }
  },

  async claimAchievement(id: string): Promise<{ achievement: Achievement; xpAwarded: number; goldAwarded: number }> {
    try {
      const result = await fetchJson<{ achievement: Achievement; xpAwarded: number; goldAwarded: number }>(`/api/achievements/${id}/claim`, {
        method: 'POST',
      });
      return result;
    } catch {
      await dbStore.delay(150);
      const ach = dbStore.achievements.find((a) => a.id === id);
      if (!ach) throw new Error('Achievement not found');
      if (!ach.unlocked) throw new Error('Achievement requirements not yet met');

      return {
        achievement: { ...ach },
        xpAwarded: ach.rewardXp,
        goldAwarded: ach.rewardGold,
      };
    }
  },
};
