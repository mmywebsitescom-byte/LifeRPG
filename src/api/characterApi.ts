import { Character, CharacterEquipment } from '../types';
import { dbStore } from './store';
import { fetchJson } from './client';

const makeEmptyCharacter = (): Character => ({
  id: 'char_default',
  userId: dbStore.user?.id || '',
  name: dbStore.user?.name || 'Hero',
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
});

export const characterApi = {
  async getCharacter(): Promise<Character> {
    try {
      const data = await fetchJson<Character>('/api/character');
      dbStore.character = data;
      return { ...data };
    } catch {
      await dbStore.delay(100);
      if (!dbStore.character) {
        dbStore.character = makeEmptyCharacter();
      }
      return {
        ...dbStore.character,
        attributes: { ...makeEmptyCharacter().attributes, ...(dbStore.character.attributes || {}) },
        equipment: { ...(dbStore.character.equipment || {}) },
        recentGains: { ...(dbStore.character.recentGains || {}) },
      };
    }
  },

  async updateCharacter(updates: Partial<Character>): Promise<Character> {
    try {
      const data = await fetchJson<Character>('/api/character', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      dbStore.character = data;
      return { ...data };
    } catch {
      await dbStore.delay(100);
      const base = dbStore.character || makeEmptyCharacter();
      dbStore.character = {
        ...base,
        ...updates,
        attributes: {
          ...base.attributes,
          ...(updates.attributes || {}),
        },
      };
      return { ...dbStore.character };
    }
  },

  async equipItem(slot: keyof CharacterEquipment, itemName: string): Promise<Character> {
    try {
      const data = await fetchJson<Character>('/api/character/equip', {
        method: 'POST',
        body: JSON.stringify({ slot, itemName }),
      });
      dbStore.character = data;
      return { ...data };
    } catch {
      await dbStore.delay(100);
      if (!dbStore.character) {
        dbStore.character = makeEmptyCharacter();
      }
      dbStore.character.equipment = {
        ...dbStore.character.equipment,
        [slot]: itemName,
      };
      return { ...dbStore.character };
    }
  },

  async setupInitialHero(heroClass: Character['heroClass'], name: string, avatarUrl: string): Promise<Character> {
    try {
      const data = await fetchJson<Character>('/api/character/setup', {
        method: 'POST',
        body: JSON.stringify({ heroClass, name, avatarUrl }),
      });
      dbStore.character = data;
      return { ...data };
    } catch {
      await dbStore.delay(150);
      if (!dbStore.character) {
        dbStore.character = makeEmptyCharacter();
      }
      dbStore.character.heroClass = heroClass;
      dbStore.character.name = name;
      dbStore.character.avatarUrl = avatarUrl;
      const titleMap = {
        Warrior: 'Vanguard of Discipline',
        Scholar: 'Seeker of Prismatic Knowledge',
        Creator: 'Architect of New Realities',
        Explorer: 'Pioneer of the Unknown Frontiers',
      };
      dbStore.character.title = titleMap[heroClass] || 'Hero of the Realm';
      return { ...dbStore.character };
    }
  },
};
