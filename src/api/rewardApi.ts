import { RewardItem } from '../types';
import { dbStore } from './store';
import { fetchJson } from './client';
import { DEFAULT_REWARDS } from './defaultRewards';

export const rewardApi = {
  async getRewards(): Promise<RewardItem[]> {
    try {
      const data = await fetchJson<RewardItem[]>('/api/rewards');
      if (Array.isArray(data) && data.length > 0) {
        dbStore.rewards = data;
        return [...data];
      }
      return dbStore.rewards.length > 0 ? [...dbStore.rewards] : [...DEFAULT_REWARDS];
    } catch {
      await dbStore.delay(100);
      return dbStore.rewards.length > 0 ? [...dbStore.rewards] : [...DEFAULT_REWARDS];
    }
  },

  async purchaseReward(rewardId: string): Promise<{ reward: RewardItem; remainingGold: number }> {
    try {
      const result = await fetchJson<{ reward: RewardItem; remainingGold: number }>(`/api/rewards/${rewardId}/purchase`, {
        method: 'POST',
      });
      const item = dbStore.rewards.find((r) => r.id === rewardId);
      if (item) item.owned = true;
      dbStore.character.gold = result.remainingGold;
      return result;
    } catch {
      await dbStore.delay(200);
      const item = dbStore.rewards.find((r) => r.id === rewardId);
      if (!item) throw new Error('Item not found in rewards inventory.');
      if (item.owned) throw new Error('You already own this item.');
      if (dbStore.character.gold < item.price) {
        throw new Error(`Insufficient gold! You need ${item.price} gold, but only have ${dbStore.character.gold}. Complete more quests!`);
      }

      dbStore.character.gold -= item.price;
      item.owned = true;

      if (item.statBonus) {
        dbStore.character.attributes[item.statBonus.attribute] += item.statBonus.amount;
      }

      dbStore.history.unshift({
        id: `his_${Date.now()}`,
        title: `Acquired ${item.name}`,
        category: 'Personal',
        xpGained: 0,
        goldGained: -item.price,
        timestamp: 'Just now',
        type: 'shop_purchase',
      });

      return {
        reward: { ...item },
        remainingGold: dbStore.character.gold,
      };
    }
  },

  async toggleEquip(rewardId: string): Promise<RewardItem> {
    try {
      const result = await fetchJson<RewardItem>(`/api/rewards/${rewardId}/equip`, {
        method: 'POST',
      });
      const item = dbStore.rewards.find((r) => r.id === rewardId);
      if (item) item.equipped = result.equipped;
      return result;
    } catch {
      await dbStore.delay(100);
      const item = dbStore.rewards.find((r) => r.id === rewardId);
      if (!item || !item.owned) throw new Error('Item is not owned.');

      item.equipped = !item.equipped;

      if (item.category === 'Gear') {
        if (item.name.toLowerCase().includes('sword') || item.name.toLowerCase().includes('blade')) {
          dbStore.character.equipment.weapon = item.equipped ? item.name : undefined;
        } else if (item.name.toLowerCase().includes('cloak') || item.name.toLowerCase().includes('armor')) {
          dbStore.character.equipment.armor = item.equipped ? item.name : undefined;
        } else if (item.name.toLowerCase().includes('boots')) {
          dbStore.character.equipment.boots = item.equipped ? item.name : undefined;
        } else if (item.name.toLowerCase().includes('ring')) {
          dbStore.character.equipment.ring = item.equipped ? item.name : undefined;
        }
      } else if (item.category === 'Pets') {
        dbStore.character.equipment.pet = item.equipped ? item.name : undefined;
      }

      return { ...item };
    }
  },
};
